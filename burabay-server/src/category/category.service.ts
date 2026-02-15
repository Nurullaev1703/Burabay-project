import { HttpStatus, Injectable } from '@nestjs/common';
import { CatchErrors, Utils } from 'src/utilities';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { MainPageFilter } from 'src/main-page/types/main-page-filters.type';
import stringSimilarity from 'string-similarity-js';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
  ) {}

  /** Получить все Категории. */
  async findAll() {
    try {
      return await this.categoryRepository.find({ relations: { subcategories: true } });
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /** Получить Категорию по id. */
  async findOne(id: string) {
    try {
      const subcategory = await this.categoryRepository.findOne({
        where: { id: id },
        relations: { subcategories: true },
      });
      Utils.checkEntity(subcategory, 'Категория не найдена');
      return subcategory;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /** Добавить/Убрать категорию в списке избранный категорий пользователя. */
  @CatchErrors()
  async addOrDeleteFavoritedCategory(userId: string, categoryId: string) {
    // Получение пользователя и категории.
    const [user, category] = await Promise.all([
      this.userRepository.findOne({
        where: { id: userId },
        relations: ['categoriesFavorited'],
      }),
      this.categoryRepository.findOne({ where: { id: categoryId } }),
    ]);
    Utils.checkEntity(user, 'Пользователь не найден');
    Utils.checkEntity(category, 'Категория не найдена');

    // Проверка на наличие категории в списке избранных.
    const categoryIndex = user.categoriesFavorited.findIndex((cat) => cat.id === categoryId);

    // Если категория есть в списке, то удалить.
    if (categoryIndex >= 0) {
      user.categoriesFavorited.splice(categoryIndex, 1);
    }
    // Если категории нет в списке, то добавить.
    else {
      user.categoriesFavorited.push(category);
    }
    // Сохранение изменений.
    await this.userRepository.save(user);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Получить список избранных категорий пользователя. */
  @CatchErrors()
  async getFavoritedCategories(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['categoriesFavorited'],
      select: { categoriesFavorited: { id: true, name: true, imgPath: true } },
    });
    Utils.checkEntity(user, 'Пользователь не найден');
    return user.categoriesFavorited;
  }

  /** Получить объявления из избранной категории пользователя с фильтрацией */
  @CatchErrors()
  async getAdsFromFavoritedCategories(userId: string, filter?: MainPageFilter) {
    // Найти пользователя.
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { categoriesFavorited: true, favorites: true },
    });
    Utils.checkEntity(user, 'Пользователь не найден');

    const categoriesId = user.categoriesFavorited.map((cat) => cat.id);

    if (categoriesId.length === 0) {
      return [];
    }

    // Получение объявлений напрямую через Ad entity
    const queryBuilder = this.adRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.category', 'category')
      .leftJoinAndSelect('ad.address', 'address')
      .leftJoinAndSelect('ad.organization', 'organization')
      .where('category.id IN (:...categoriesId)', { categoriesId })
      .andWhere('organization.isBanned = :isBanned', { isBanned: false });

    // Фильтр по цене
    if (filter?.minPrice && filter?.maxPrice) {
      queryBuilder.andWhere('ad.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
      });
    } else if (filter?.maxPrice) {
      queryBuilder.andWhere('ad.price <= :maxPrice', {
        maxPrice: filter.maxPrice,
      });
    } else if (filter?.minPrice) {
      queryBuilder.andWhere('ad.price >= :minPrice', {
        minPrice: filter.minPrice,
      });
    }

    // Фильтр только с высоким рейтингом
    if (filter?.isHighRating === true || String(filter?.isHighRating) === 'true') {
      queryBuilder.andWhere('ad.avgRating > :rating', { rating: 4.5 });
    }

    const ads = await queryBuilder
      .select([
        'ad.id',
        'ad.title',
        'ad.images',
        'ad.price',
        'ad.details',
        'ad.avgRating',
        'ad.reviewCount',
        'ad.createdAt',
        'address.address',
        'address.specialName',
        'subcategory.name',
        'category.name',
        'category.imgPath',
      ])
      .orderBy('ad.createdAt', 'DESC')
      .skip(filter?.offset || 0)
      .take(filter?.limit || 10)
      .getMany();

    // Добавляем информацию об избранном
    const allAds = ads.map((ad) => ({
      ...ad,
      isFavourite: user.favorites.some((favAd) => favAd.id === ad.id),
    }));

    // Применяем поиск по названию если указан
    if (filter?.name) {
      return this._searchAd(filter.name, allAds);
    }

    return allAds;
  }

  /** Поиск объявлений по названию */
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
