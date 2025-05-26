import { HttpStatus, Injectable } from '@nestjs/common';
import { CatchErrors, Utils } from 'src/utilities';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Ad } from 'src/ad/entities/ad.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
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

  /** Получить объявления из избранной категории пользователя */
  @CatchErrors()
  async getAdsFromFavoritedCategories(userId: string, page?: number) {
    // Найти пользователя.
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { categoriesFavorited: true },
    });
    const categoriesId = user.categoriesFavorited.map((cat) => cat.id);
    const subcategories = await this.subcategoryRepository.find({
      where: { category: { id: In(categoriesId) } },
      relations: { ads: { subcategory: { category: true } } },
      select: {
        id: true,
        ads: {
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
      },
      skip: (page - 1) * 10 || 0,
      take: 10,
    });
    const ads: Ad[] = [];
    for (const subcategory of subcategories) {
      ads.push(...subcategory.ads);
    }
    return ads;
  }
}
