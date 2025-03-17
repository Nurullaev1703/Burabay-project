import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { DataSource, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Organization } from 'src/users/entities/organization.entity';
import { CatchErrors, Utils } from 'src/utilities';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { User } from 'src/users/entities/user.entity';
import { AdFilter } from './types/ad-filter.type';
import stringSimilarity from 'string-similarity-js';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { Booking } from 'src/booking/entities/booking.entity';
import { BookingBanDate } from 'src/booking-ban-date/entities/booking-ban-date.entity';

@Injectable()
export class AdService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingBanDate)
    private readonly bookingBanDatesRepository: Repository<BookingBanDate>,
    private readonly dataSource: DataSource,
  ) {}

  /* Создания Объявления. Принимает айти Подкатегории и Организации. */
  @CatchErrors()
  async create(createAdDto: CreateAdDto) {
    const { organizationId, subcategoryId, ...otherFields } = createAdDto;

    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
    });
    Utils.checkEntity(subcategory, 'Подкатегория не найдена');

    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    Utils.checkEntity(organization, 'Организация не найдена');

    const newAd = this.adRepository.create({
      organization: organization,
      subcategory: subcategory,
      createdAt: new Date(),
      ...otherFields,
    });
    await this.adRepository.save(newAd);
    return JSON.stringify(newAd.id);
  }

  /* Получения всех Объявлений.
     Может принимать фильтр по категориям и соответствию названия. */
  @CatchErrors()
  async findAll(tokenData: TokenData, filter?: AdFilter) {
    let ads: Ad[];
    // По Подкатегории.
    if (filter.categoryNames) {
      const categoryNamesArr = filter.categoryNames.split(',');
      ads = await this.adRepository.find({
        where: { subcategory: { category: { name: In(categoryNamesArr) } } },
        relations: {
          bookingBanDate: true,
          organization: true,
          schedule: true,
          breaks: true,
          address: true,
          subcategory: { category: true },
          usersFavorited: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      // Без Подкатегории.
    } else {
      ads = await this.adRepository.find({
        relations: {
          bookingBanDate: true,
          organization: true,
          schedule: true,
          breaks: true,
          address: true,
          subcategory: { category: true },
          usersFavorited: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    }
    if (filter.adName) {
      ads = this._searchAd(filter.adName, ads);
    }
    const result = ads.map((ad) => {
      const isFavourite =
        ad.usersFavorited.find((u) => u.id === tokenData.id) === undefined ? false : true;
      delete ad.usersFavorited;
      return { ...ad, isFavourite };
    });

    return result;
  }

  /* Получения всех Объявлений у Организации */
  @CatchErrors()
  async findAllByOrg(orgId: string, filter?: AdFilter) {
    const queryParams =
      filter.limit && filter.offset
        ? {
            take: filter.limit,
            skip: filter.offset,
          }
        : {};
    let ads = await this.adRepository.find({
      where: {
        organization: { id: orgId },
      },
      relations: {
        bookingBanDate: true,
        organization: true,
        schedule: true,
        breaks: true,
        address: true,
        subcategory: {
          category: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      ...queryParams,
    });
    Utils.checkEntity(ads, 'Объявления не найдены');
    if (filter.adName) {
      ads = this._searchAd(filter.adName, ads);
    }
    return ads;
  }

  /* Получение всех избранные Объявлений Пользователя по его токену. */
  @CatchErrors()
  async findAllFavorite(tokenData: TokenData) {
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      relations: {
        favorites: { organization: true, subcategory: { category: true } },
      },
      select: {
        favorites: {
          id: true,
          title: true,
          price: true,
          images: true,
          avgRating: true,
          reviewCount: true,
          address: {
            specialName: true,
            address: true,
          },
          organization: {
            id: true,
            name: true,
            isBanned: true,
            isConfirmed: true,
          },
          subcategory: { name: true, category: { name: true, imgPath: true } },
        },
      },
    });
    Utils.checkEntity(user, 'Пользователь не найден');
    Utils.checkEntity(user.favorites, 'Пользователь не имеет любимых объявлений');
    const result = user.favorites.map((ad) => {
      return {
        ...ad,
        isFavourite: true,
      };
    });
    return result;
  }

  /* Получения одного Объявления по id. В случае если пользователь Турист,то увеличивает кол-во просмотров Объявления. */
  @CatchErrors()
  async findOne(id: string, tokenData?: TokenData) {
    const ad = await this.adRepository.findOne({
      where: { id: id },
      relations: {
        subcategory: { category: true },
        organization: true,
        schedule: true,
        breaks: true,
        address: true,
        usersFavorited: true,
        bookingBanDate: true,
      },
    });
    Utils.checkEntity(ad, 'Объявление не найдено');

    const favCount = ad.usersFavorited.length;
    // Проверка, является ли объявление Избранным.
    const isFavourite =
      ad.usersFavorited.find((u) => u.id === tokenData.id) === undefined ? false : true;
    delete ad.usersFavorited;

    // Если пользователь Турист, то увеличивает кол-во просмотров Объявления.
    if (tokenData) {
      const user = await this.userRepository.findOne({
        where: { id: tokenData.id },
        relations: { favorites: true },
      });
      Utils.checkEntity(user, 'Пользователь не найден');
      if (user.role === ROLE_TYPE.TOURIST) {
        ad.views++;
        await this.adRepository.save(ad);
      }
    }
    ad.bookingBanDate = ad.bookingBanDate.filter((bd) => bd.isByBooking === false);
    return { ...ad, favCount, isFavourite };
  }

  /* Добавление Объявление в список избранного Пользователя по его токену. */
  @CatchErrors()
  async addToFavorites(tokenData: TokenData, adId: string) {
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      relations: { favorites: true },
    });
    Utils.checkEntity(user, 'Пользователь не найден');

    const ad = await this.adRepository.findOne({ where: { id: adId } });
    Utils.checkEntity(ad, 'Объявление не найдено');

    // Проверяем, есть ли объявление уже в избранных
    const favoriteIndex = user.favorites.findIndex((fav) => fav.id === ad.id);
    if (favoriteIndex === -1) {
      user.favorites.push(ad);
    } else {
      user.favorites.splice(favoriteIndex, 1);
    }
    await this.userRepository.save(user);
    return JSON.stringify(HttpStatus.CREATED);
  }

  /* Редактирования Объявления. Принимает айди Объявления. */
  @CatchErrors()
  async update(id: string, updateAdDto: UpdateAdDto) {
    const { subcategoryId, ...oF } = updateAdDto;
    const ad = await this.adRepository.findOne({ where: { id: id } });
    Utils.checkEntity(ad, 'Объявление не найдено');

    if (subcategoryId) {
      const subcategory = await this.subcategoryRepository.findOne({
        where: { id: subcategoryId },
      });
      Utils.checkEntity(subcategory, 'Категория не найдена');
      Object.assign(ad, { subcategory: subcategory, ...oF });
    } else {
      Object.assign(ad, oF);
    }
    return this.adRepository.save(ad);
  }

  /* Удаления Объявления. */
  @CatchErrors()
  async remove(id: string) {
    return await this.dataSource.transaction(async (manager) => {
      const ad = await manager.findOne(Ad, {
        where: { id: id },
        relations: {
          schedule: true,
          bookingBanDate: true,
          breaks: true,
          bookings: true,
        },
      });
      Utils.checkEntity(ad, 'Объявление не найдено');
      if (ad.bookings.length > 0) {
        return {
          message:
            'Невозможно удалить объявление, так как оно забронировано. Вы можете скрыть объявление для брони',
          code: HttpStatus.CONFLICT,
        };
      }
      if (ad.schedule) await manager.remove(ad.schedule);
      if (ad.bookingBanDate) await manager.remove(ad.bookingBanDate);
      if (ad.breaks) await manager.remove(ad.breaks);
      await manager.remove(ad);
      return JSON.stringify(HttpStatus.OK);
    });
  }

  /* Проверка свободного диапазона для Бронирования. */
  @CatchErrors()
  async _checkDates(adId: string, startDateDto: string, endDateDto: string) {
    // Форматирование переданных дат в тип даты.
    const startDate = Utils.stringDateToDate(startDateDto);
    const endDate = Utils.stringDateToDate(endDateDto);
    // Получение всех броней в указанном диапазоне.
    const bookings = await this.bookingRepository.find({
      where: {
        ad: { id: adId },
        dateStart: LessThanOrEqual(endDate),
        dateEnd: MoreThanOrEqual(startDate),
      },
    });
    // Получение всех Booking Ban Dates с указанной датой.
    const bookingBanDates = await this.bookingBanDatesRepository.find({
      where: { ad: { id: adId }, date: Utils.dateToString(startDate) },
    });

    // Если брони в указанном диапазоне не были найдены,то вернуть true, иначе вернуть занятные даты.
    if (bookings.length === 0 && bookingBanDates.length === 0) {
      return true;
    } else {
      return {
        message: 'Даты заняты',
        dates: bookings.map(
          (booking) => {
            return {
              startDate: Utils.dateToString(booking.dateStart),
              endDate: Utils.dateToString(booking.dateEnd),
            };
          },
          // `${Utils.dateToString(booking.dateStart)} - ${Utils.dateToString(booking.dateEnd)}`,
        ),
      };
    }
  }

  @CatchErrors()
  async checkDates(adId: string) {
    const ad = await this.adRepository.findOne({
      where: { id: adId },
      relations: { bookings: true },
    });
    Utils.checkEntity(ad, 'Объявление не найдено');
    const bookedDates = [];
    ad.bookings.forEach((booking) => {
      console.log(booking);
      if (!booking.date) {
        bookedDates.push({
          startDate: Utils.dateToString(booking.dateStart),
          endDate: Utils.dateToString(booking.dateEnd),
        });
      } else {
        bookedDates.push({
          startDate: booking.date,
        });
      }
    });
    return bookedDates;
  }

  @CatchErrors()
  async getAdsFromOrg(orgId: string, tokenData: TokenData) {
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      select: { id: true },
    });
    Utils.checkEntity(user, 'Пользователь не найден');
    const org = await this.organizationRepository.findOne({
      where: { id: orgId },
      relations: {
        ads: {
          subcategory: { category: true },
          usersFavorited: true,
          address: true,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        siteUrl: true,
        imgUrl: true,
        isConfirmed: true,
        ads: {
          id: true,
          title: true,
          images: true,
          price: true,
          address: { specialName: true, address: true },
          usersFavorited: { id: true },
          avgRating: true,
          reviewCount: true,
          subcategory: {
            name: true,
            category: {
              name: true,
              imgPath: true,
            },
          },
        },
      },
    });
    Utils.checkEntity(org, 'Организация не найдена');
    const ads = [];
    org.ads.forEach((ad) => {
      const result = ad.usersFavorited.filter((userFav) => userFav.id === user.id).length;
      delete ad.usersFavorited;
      ads.push({
        isFavourite: result > 0,
        ...ad,
      });
    });
    return {
      ...org,
      ads,
    };
  }

  /* Поиск среди Объявлений. */
  private _searchAd(name: string, ads: Ad[]): Ad[] {
    const searchedAds = [];
    ads.forEach((ad) => {
      const simValue = stringSimilarity(ad.title, name);
      if (simValue > 0.2)
        searchedAds.push({
          prod: ad,
          simValue: simValue,
        });
    });
    searchedAds.sort((a, b) => b.simValue - a.simValue);
    return searchedAds.map((ad) => ad.prod);
  }
}
