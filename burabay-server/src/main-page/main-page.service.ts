import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { AdFilter } from 'src/ad/types/ad-filter.type';
import { Category } from 'src/category/entities/category.entity';
import { CatchErrors, Utils } from 'src/utilities';
import { Between, DataSource, In, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not, Raw, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource,
  ) { }

  /* Получние всех Объявлений с возможность Фильтрации по ценам, подкатегории, подробностям, высокому рейтингу, дате аренды и названию.  */
  @CatchErrors()
  async getMainPageAds(tokenData: TokenData, mainPageFilter?: MainPageFilter) {
    const offset = mainPageFilter?.offset ?? 0;
    const limit = mainPageFilter?.limit ?? 10;

    const other = { ...mainPageFilter };
    delete other.offset;
    delete other.limit;

    const isNoAdditionalFilters = !Object.keys(other).length;

    const cacheKey = `ads`;

    // Если фильтры не переданы, то возвращаем все объявления, при наличии из кэша.
    if (isNoAdditionalFilters) {
      const cachedAds = await this.cacheManager.get(cacheKey);
      let ads: Ad[];
      if (cachedAds) {
        // Если нужный кэш есть, возвращаем его.
        ads = cachedAds as Ad[];
      } else {
        // Если кэша нет, получаем объявления из БД.
        ads = await this.adRepository.find({
          where: { organization: { isBanned: false } },
          relations: { subcategory: { category: true }, address: true, organization: true },
          select: {
            id: true,
            address: { address: true, specialName: true },
            title: true,
            description: true,
            images: true,
            price: true,
            details: {},
            avgRating: true,
            reviewCount: true,
            createdAt: true,
            subcategory: { name: true, category: { name: true, imgPath: true } },
          },
          order: { createdAt: 'DESC' },
        });

        // Сохраняем полученные объявления в кэш.
        await this.cacheManager.set(cacheKey, ads, 3600000); // Кэшируем на 1 час.
      }
      // Пагинация вручную из кэша.
      ads = ads.slice(offset, offset + limit);

      // Получаем избранные объявления пользователя.
      const userFavorites = await this.dataSource
        .createQueryBuilder()
        .select('ufa.adId')
        .from('user_favorites_ad', 'ufa')
        .where('ufa.userId = :userId', { userId: tokenData.id })
        .getRawMany();
      // Преобразуем в Set для быстрого поиска.
      const favoriteIds = new Set(userFavorites.map((f) => f.adId));
      const result = ads.map((ad) => ({ ...ad, isFavourite: favoriteIds.has(ad.id) }));
      return result;
    }

    let whereOptions: any = { organization: { isBanned: false } };

    // Фильтр по цене
    if (mainPageFilter.minPrice && mainPageFilter.maxPrice)
      whereOptions.price = Between(mainPageFilter.minPrice, mainPageFilter.maxPrice);
    else if (mainPageFilter.maxPrice) whereOptions.price = LessThanOrEqual(mainPageFilter.maxPrice);
    else if (mainPageFilter.minPrice) whereOptions.price = MoreThanOrEqual(mainPageFilter.minPrice);

    // Фильтр только с высоким рейтингом — учитываем, что параметр может прийти как boolean или как строка 'true'
    if (mainPageFilter.isHighRating === true || String(mainPageFilter.isHighRating) === 'true')
      whereOptions.avgRating = MoreThan(4.5);

    // Поиск по свободным датам заселения и выезда.
    if (mainPageFilter.startDate && mainPageFilter.endDate) {
      const tryStartDate: Date = Utils.stringDateToDate(mainPageFilter.startDate);
      const tryEndDate: Date = Utils.stringDateToDate(mainPageFilter.endDate);

      const bookings = await this.bookingRepository.find({
        relations: { ad: true },
        where: { dateStart: LessThanOrEqual(tryEndDate), dateEnd: MoreThanOrEqual(tryStartDate) },
        select: { ad: { id: true }, dateEnd: true, dateStart: true },
      });

      const adsIds = bookings.map((booking) => booking.ad.id);
      if (adsIds.length > 0) whereOptions = { ...whereOptions, id: Not(In(adsIds)) };
    }

    // Фильтр по дате въезда, без даты выезда.
    if (mainPageFilter.startDate && !mainPageFilter.endDate) {
      const tryStartDate: Date = Utils.stringDateToDate(mainPageFilter.startDate);
      const bookings = await this.bookingRepository.find({
        relations: { ad: true },
        where: { dateStart: LessThanOrEqual(tryStartDate), dateEnd: MoreThanOrEqual(tryStartDate) },
        select: { ad: { id: true }, dateEnd: true, dateStart: true },
      });

      const adsIds = bookings.map((booking) => booking.ad.id);
      if (adsIds.length > 0) whereOptions = { ...whereOptions, id: Not(In(adsIds)) };
    }

    // фильтр по категориям
    if (mainPageFilter.category)
      whereOptions = { ...whereOptions, subcategory: { category: { name: mainPageFilter.category } } };

    // Фильтр по подкатегории
    if (mainPageFilter.subcategories) {
      const subcategories = mainPageFilter.subcategories.split(',');
      whereOptions = { ...whereOptions, subcategory: { name: In(subcategories) } };
    }

    // Фильтр по подробностям
    if (mainPageFilter.details) {
      const trueDetails = mainPageFilter.details.split(',');

      if (trueDetails.length > 0)
        whereOptions.details = Raw((alias) => `${alias} @> :details`, {
          details: JSON.stringify(Object.fromEntries(trueDetails.map((key) => [key, true]))),
        });
    }

    let ads: Ad[];

    // Поиск по названию
    if (mainPageFilter.name) {
      ads = await this.adRepository.find({
        where: whereOptions,
        relations: {
          subcategory: { category: true },
          address: true,
          organization: true,
        },
        select: {
          id: true,
          address: { address: true, specialName: true },
          title: true,
          description: true,
          images: true,
          price: true,
          details: {},
          avgRating: true,
          reviewCount: true,
          createdAt: true,
          subcategory: { name: true, category: { name: true, imgPath: true } },
          organization: { name: true },
        },
        order: { createdAt: 'DESC' },
      });
      ads = this._searchAd(mainPageFilter.name, ads);
      // Ограничение до 10 результатов.
      ads = ads.slice(0, 10);
    } else {
      // Получение объявлений.
      ads = await this.adRepository.find({
        where: whereOptions,
        relations: {
          subcategory: { category: true },
          address: true,
          organization: true,
        },
        select: {
          id: true,
          address: { address: true, specialName: true },
          title: true,
          description: true,
          images: true,
          price: true,
          details: {},
          avgRating: true,
          reviewCount: true,
          createdAt: true,
          subcategory: { name: true, category: { name: true, imgPath: true } },
          organization: { name: true },
        },
        order: { createdAt: 'DESC' },
        skip: mainPageFilter.offset || 0,
        take: mainPageFilter.limit || 10,
      });
    }
    // Получаем избранные объявления пользователя.
    const userFavorites = await this.dataSource
      .createQueryBuilder()
      .select('ad.id')
      .from('user_favorites_ad', 'ufa')
      .innerJoin('ad', 'ad', 'ad.id = ufa.adId')
      .where('ufa.userId = :userId', { userId: tokenData.id })
      .getRawMany();
    // Преобразуем в Set для быстрого поиска.
    const favoriteIds = new Set(userFavorites.map((f) => f.id));
    const result = ads.map((ad) => ({ ...ad, isFavourite: favoriteIds.has(ad.id) }));
    return result;
  }

  /** Получить категории для главной страницы. */
  async getMainPageCategories() {
    // Получить данные из Redis.
    const cachedCategories = await this.cacheManager.get('all_categories');
    if (cachedCategories) return cachedCategories;

    const categories = await this.categoryRepository.find({
      select: {
        id: true,
        name: true,
        imgPath: true,
      },
    });
    await this.cacheManager.set('all_categories', categories, 3600000);
    return categories;
  }

  /** Получить банеры для главной страницы. */
  @CatchErrors()
  async getBanners(skip?: number, take?: number, search?: string, sortDir?: 'DESC' | 'ASC') {
    // Получить банеры из БД с пагинацией или все банеры, если параметры не переданы
    const findOptions: any = {
      order: {
        deleteDate: sortDir || 'ASC',
      },
    };

    // Поиск по заголовку
    if (search) {
      findOptions.where = [
        {
          title: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:search)`, {
            search: `%${search}%`,
          }),
        },
        {
          text: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:search)`, {
            search: `%${search}%`,
          }),
        },
      ];
    }

    if (skip !== undefined) findOptions.skip = skip;
    if (take !== undefined) findOptions.take = take;

    const banners = await this.bannerRepository.find(findOptions);

    // Получить общее количество баннеров с учетом фильтра поиска
    const totalCount = await this.bannerRepository.count(
      search ? {
        where: [
          { title: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:search)`, { search: `%${search}%`, }) },
          { text: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:search)`, { search: `%${search}%`, }) },
        ]
      } : {},
    );

    const result = {
      data: banners,
      total: totalCount,
      skip: skip ?? 0,
      take: take ?? totalCount,
      hasMore: skip !== undefined && take !== undefined ? skip + take < totalCount : false,
    };
    return result;
  }

  async getBannerById(id: string) {
    const banner = await this.bannerRepository.findOne({
      where: { id },
    });
    return banner;
  }

  /** Скорее всего неактуальный метод, который не используется. */
  async getMainPageAnnouncements(filter?: AdFilter) {
    let whereOptions = {};
    if (filter.category) {
      whereOptions = {
        ...whereOptions,
        subcategory: { category: { name: filter.category } },
      };
    }
    let announcements = [];
    // Если поиск, то все и фильтруем по названию
    if (filter.adName) {
      announcements = await this.adRepository.find({
        where: whereOptions,
        relations: { organization: true, subcategory: { category: true }, address: true },
        order: {
          createdAt: 'DESC',
        },
      });
      announcements = this._searchAd(filter.adName, announcements);
      // Ограничение до 10 результатов.
      announcements = announcements.slice(0, 10);
    } else {
      announcements = await this.adRepository.find({
        where: whereOptions,
        relations: { organization: true, subcategory: { category: true }, address: true },
        order: {
          createdAt: 'DESC',
        },
        skip: filter.offset || 0,
        take: filter.limit || 10,
      });
    }

    return announcements;
  }

  /** Поиск объявлений по имени. */
  private _searchAd(name: string, ads: Ad[]): Ad[] {
    const query = name.toLowerCase();

    return ads.filter((ad) => {
      const title = ad.title?.toLowerCase() || '';
      const orgName = ad.organization?.name?.toLowerCase() || '';

      return title.includes(query) || orgName.includes(query);
    });
  }
}
