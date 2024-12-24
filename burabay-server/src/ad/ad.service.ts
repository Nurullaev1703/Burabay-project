import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { In, Repository } from 'typeorm';
import { Organization } from 'src/users/entities/organization.entity';
import { CatchErrors, Utils } from 'src/utilities';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { User } from 'src/users/entities/user.entity';
import { AdFilter } from './types/ad.filter';
import stringSimilarity from 'string-similarity-js';

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
      ...otherFields,
    });

    return this.adRepository.save(newAd);
  }

  /* Метод для получения всех Объявлений.
     Может принимать фильтр по категориям и соответствию названия. */
  @CatchErrors()
  async findAll(filter?: AdFilter) {
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
        },
      });
    }
    if (filter.adName) {
      ads = this._searchAd(filter.adName, ads);
    }
    return ads;
  }

  /* Метод для получения всех Объявлений у Организации */
  @CatchErrors()
  async findAllByOrg(orgId: string) {
    const ads = await this.adRepository.find({
      where: {
        organization: { id: orgId },
      },
      relations: {
        bookingBanDate: true,
        organization: true,
        schedule: true,
        breaks: true,
        address: true,
      },
    });
    Utils.checkEntity(ads, 'Объявления не найдены');
    return ads;
  }

  @CatchErrors()
  async findAllFavorite(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favorites: { organization: true } },
    });
    Utils.checkEntity(user, 'Пользователь не найден');
    Utils.checkEntity(user.favorites, 'Пользователь не имеет любимых объявлений');
    return user.favorites;
  }

  /* Метод для получения одного Объявления по id. */
  @CatchErrors()
  async findOne(id: string) {
    const ad = await this.adRepository.findOne({
      where: { id: id },
      relations: {
        subcategory: { category: true },
        organization: true,
        schedule: true,
        breaks: true,
        address: true,
        usersFavorited: true,
      },
    });
    Utils.checkEntity(ad, 'Объявление не найдено');
    const favCount = ad.usersFavorited.length;
    delete ad.usersFavorited;
    ad.views++;
    await this.adRepository.save(ad);
    return { ...ad, favCount };
  }

  @CatchErrors()
  async addToFavorites(userId: string, adId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favorites: true },
    });
    Utils.checkEntity(user, 'Пользователь не найден');

    const ad = await this.adRepository.findOne({ where: { id: adId } });
    Utils.checkEntity(ad, 'Объявление не найдено');

    // Проверяем, есть ли объявление уже в избранных
    if (!user.favorites.some((fav) => fav.id === ad.id)) {
      user.favorites.push(ad);
      await this.userRepository.save(user);
    }
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
    const ad = await this.adRepository.findOne({ where: { id: id } });
    Utils.checkEntity(ad, 'Объявление не найдено');
    await this.adRepository.remove(ad);
    return JSON.stringify(HttpStatus.OK);
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
