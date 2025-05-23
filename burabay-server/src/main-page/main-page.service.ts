import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { AdFilter } from 'src/ad/types/ad-filter.type';
import { Category } from 'src/category/entities/category.entity';
import { CatchErrors, Utils } from 'src/utilities';
import stringSimilarity from 'string-similarity-js';
import {
  Between,
  In,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Raw,
  Repository,
} from 'typeorm';
import { MainPageFilter } from './types/main-page-filters.type';
import { Booking } from 'src/booking/entities/booking.entity';
import { Banner } from 'src/admin-panel/entities/baner.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MainPageService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  /** Скорее всего неактуальный метод, который не используется. */
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

  /* Получние всех Объявлений с возможность Фильтрации по ценам, подкатегории, подробностям, высокому рейтингу, дате аренды и названию.  */
  @CatchErrors()
  async getMainPageAds(tokenData: TokenData, mainPageFilter?: MainPageFilter) {
    // Если фильтры не переданы, то возвращаем все объявления, при наличии из кэша.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const offset = mainPageFilter?.offset ?? 0;
    const limit = mainPageFilter?.limit ?? 10;

    const other = { ...mainPageFilter };
    delete other.offset;
    delete other.limit;

    const isNoAdditionalFilters = !Object.keys(other).length;

    const cacheKey = `ads:${offset}:${limit}`;

    if (isNoAdditionalFilters) {
      const cachedAds = await this.cacheManager.get(cacheKey);
      if (cachedAds) {
        return cachedAds;
      }
      const ads = await this.adRepository.find({
        relations: {
          subcategory: { category: true },
          usersFavorited: true,
          address: true,
        },
        select: {
          id: true,
          address: {
            address: true,
            specialName: true,
          },
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
        order: {
          createdAt: 'DESC',
        },
        skip: mainPageFilter.offset || 0,
        take: mainPageFilter.limit || 10,
      });
      await this.cacheManager.set(cacheKey, ads, 3600);
      return ads;
    }

    let whereOptions: any = {};

    // Фильтр по цене
    if (mainPageFilter.minPrice && mainPageFilter.maxPrice)
      whereOptions.price = Between(mainPageFilter.minPrice, mainPageFilter.maxPrice);
    else if (mainPageFilter.maxPrice) whereOptions.price = LessThanOrEqual(mainPageFilter.maxPrice);
    else if (mainPageFilter.minPrice) whereOptions.price = MoreThanOrEqual(mainPageFilter.minPrice);

    // Фильтр только с высоким рейтингом
    if (mainPageFilter.isHighRating) whereOptions.avgRating = MoreThan(4.5);

    // Поиск по свободным датам заселения и выезда.
    if (mainPageFilter.startDate && mainPageFilter.endDate) {
      const tryStartDate: Date = Utils.stringDateToDate(mainPageFilter.startDate);
      const tryEndDate: Date = Utils.stringDateToDate(mainPageFilter.endDate);
      const bookings = await this.bookingRepository.find({
        relations: { ad: true },
        where: {
          dateStart: Between(tryStartDate, tryEndDate),
          dateEnd: Between(tryStartDate, tryEndDate),
        },
        select: {
          ad: { id: true },
          dateEnd: true,
          dateStart: true,
        },
      });

      const adsIds = bookings.map((booking) => booking.ad.id);
      if (adsIds.length > 0) {
        whereOptions = {
          ...whereOptions,
          id: Not(In(adsIds)),
        };
      }
    }

    // Фильтр по дате въезда, без даты выезда.
    if (mainPageFilter.startDate && !mainPageFilter.endDate) {
      const tryStartDate: Date = Utils.stringDateToDate(mainPageFilter.startDate);
      const bookings = await this.bookingRepository.find({
        relations: { ad: true },
        where: {
          dateStart: LessThanOrEqual(tryStartDate),
          dateEnd: MoreThanOrEqual(tryStartDate),
        },
        select: {
          ad: { id: true },
          dateEnd: true,
          dateStart: true,
        },
      });

      const adsIds = bookings.map((booking) => booking.ad.id);
      if (adsIds.length > 0) {
        whereOptions = {
          ...whereOptions,
          id: Not(In(adsIds)),
        };
      }
    }

    // фильтр по категориям
    if (mainPageFilter.category) {
      whereOptions = {
        ...whereOptions,
        subcategory: {
          category: { name: mainPageFilter.category },
        },
      };
    }

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
        address: true,
      },
      select: {
        id: true,
        address: {
          address: true,
          specialName: true,
        },
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
      order: {
        createdAt: 'DESC',
      },
      skip: mainPageFilter.offset || 0,
      take: mainPageFilter.limit || 10,
    });
    const result = ads.map((ad) => ({
      ...ad,
      isFavourite: ad.usersFavorited.some((user) => user.id === tokenData.id),
    }));

    // Поиск по названию
    return mainPageFilter.name ? this._searchAd(mainPageFilter.name, result) : result;
  }

  /** Получить категории для главной страницы. */
  async getMainPageCategories() {
    // Получить данные из Redis.
    const cachedCategories = await this.cacheManager.get('all_categories');

    if (cachedCategories) {
      return cachedCategories;
    }

    const categories = await this.categoryRepository.find({
      select: {
        id: true,
        name: true,
        imgPath: true,
      },
    });
    // Категории в кэше хранятся год.
    await this.cacheManager.set('all_categories', categories, 3600);
    return categories;
  }
  /** Получить банеры для главной страницы. */
  async getBanners() {
    // Получить данные из Redis.
    const cachedBanners = await this.cacheManager.get('all_banners');
    if (cachedBanners) {
      return cachedBanners;
    }
    // Получить банеры из БД.
    const banners = await this.bannerRepository.find();
    // Банеры в кэше хранятся год.
    await this.cacheManager.set('all_banners', banners, 3600);
    return banners;
  }

  /** Поиск объявлений по имени. */
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
