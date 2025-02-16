import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { AdFilter } from 'src/ad/types/ad.filter';
import { Category } from 'src/category/entities/category.entity';
import { CatchErrors } from 'src/utilities';
import stringSimilarity from 'string-similarity-js';
import { Between, In, LessThanOrEqual, MoreThan, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { MainPageFilter } from './types/main-page-filters.type';

@Injectable()
export class MainPageService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getMainPageAnnouncements(filter?: AdFilter) {
    let whereOptions = {};
    if (filter.category) {
      whereOptions = {
        ...whereOptions,
        subcategory: {
          category: { name: filter.category },
        },
      };
    }
    const announcements = await this.adRepository.find({
      where: whereOptions,
      relations: { organization: true, subcategory: { category: true }, address: true },
      order: {
        createdAt: 'DESC',
      },
      skip: filter.offset || 0,
      take: filter.limit || 10,
    });
    return filter.adName ? this._searchAd(filter.adName, announcements) : announcements;
  }

  @CatchErrors()
  async getMainPageAds(tokenData: TokenData, mainPageFilter?: MainPageFilter) {
    let whereOptions: any = {};

    // Фильтр по цене
    if (mainPageFilter.minPrice && mainPageFilter.maxPrice)
      whereOptions.price = Between(mainPageFilter.minPrice, mainPageFilter.maxPrice);
    else if (mainPageFilter.maxPrice) whereOptions.price = LessThanOrEqual(mainPageFilter.maxPrice);
    else if (mainPageFilter.minPrice) whereOptions.price = MoreThanOrEqual(mainPageFilter.minPrice);

    // Фильтр только с высоким рейтингом
    if (mainPageFilter.isHighRating) whereOptions.avgRating = MoreThan(4.5);

    // Фильтр по подкатегории
    if (mainPageFilter.subcategories) {
      const subcategories = mainPageFilter.subcategories.split(',');
      whereOptions = { ...whereOptions, subcategory: { name: In(subcategories) } };
    }

    // Фильтр по подробностям
    if (mainPageFilter.details) {
      const trueDetails = mainPageFilter.details.split(',');

      if (trueDetails.length > 0) {
        whereOptions.details = Raw((alias) => `${alias} @> :details`, {
          details: JSON.stringify(Object.fromEntries(trueDetails.map((key) => [key, true]))),
        });
      }
    }

    // Получение объявлений
    const ads = await this.adRepository.find({
      where: whereOptions,
      relations: {
        subcategory: { category: true },
        usersFavorited: true,
      },
      order: {
        createdAt: 'DESC',
      },
      select: {
        id: true,
        title: true,
        images: true,
        price: true,
        details: {},
        avgRating: true,
        reviewCount: true,
        createdAt: true,
        subcategory: {
          name: true,
          category: {
            name: true,
            imgPath: true,
          },
        },
      },
      skip: mainPageFilter.offset || 0,
      take: mainPageFilter.limit || 10,
    });
    const userIdSet = new Set(ads.flatMap((ad) => ad.usersFavorited.map((user) => user.id)));
    const result = ads.map((ad) => ({
      ...ad,
      isFavorite: userIdSet.has(tokenData.id),
    }));

    // Поиск по названию
    return mainPageFilter.name ? this._searchAd(mainPageFilter.name, result) : result;
  }

  async getMainPageCategories() {
    return await this.categoryRepository.find();
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
