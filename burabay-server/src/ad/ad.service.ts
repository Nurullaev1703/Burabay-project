import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Organization } from 'src/users/entities/organization.entity';
import { CatchErrors, Utils } from 'src/utilities';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { User } from 'src/users/entities/user.entity';
import { AdFilter } from './types/ad.filter';
import stringSimilarity from 'string-similarity-js';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { BookingBanDate } from 'src/booking-ban-date/entities/booking-ban-date.entity';
import { Break } from 'src/breaks/entities/break.entity';

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
    // TODO упростить связки с репозиториями при удалении
    private readonly dataSource: DataSource,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(BookingBanDate)
    private readonly bookingBanDateRepository: Repository<BookingBanDate>,
    @InjectRepository(Break)
    private readonly breakRepository: Repository<Break>,
  ) {}

  /* Метод для создания Объявления. Принимает айти Категории (Подкатегории) и Организации. */
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

  /* Метод для получения всех Объявлений.
     Может принимать фильтр по категориям и соответствию названия. */
  @CatchErrors()
  async findAll(tokenData: TokenData, filter?: AdFilter) {
    let ads: Ad[];
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
    const result = ads.map((ad) => {
      const isFavourite =
        ad.usersFavorited.find((u) => u.id === tokenData.id) === undefined ? false : true;
      delete ad.usersFavorited;
      return { ...ad, isFavourite };
    });
    if (filter.adName) {
      ads = this._searchAd(filter.adName, ads);
    }

    return result;
  }

  /* Метод для получения всех Объявлений у Организации */
  @CatchErrors()
  async findAllByOrg(orgId: string, filter?: AdFilter) {
    const queryParams = filter.limit && filter.offset ? {
      take: filter.limit,
      skip: filter.offset,
    } : {}
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
      ...queryParams
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
          subcategory: { name: true, category: { imgPath: true } },
        },
      },
    });
    Utils.checkEntity(user, 'Пользователь не найден');
    Utils.checkEntity(user.favorites, 'Пользователь не имеет любимых объявлений');
    return user.favorites;
  }

  /* Метод для получения одного Объявления по id. */
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
    const isFavourite =
      ad.usersFavorited.find((u) => u.id === tokenData.id) === undefined ? false : true;
    delete ad.usersFavorited;
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

  /* Метод для редактирования Объявления. Принимает айди Объявления. */
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

  /* Метод для удаления Объявления. */
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
