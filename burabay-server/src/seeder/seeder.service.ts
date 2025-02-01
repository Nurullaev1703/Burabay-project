import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import {
  AttractionsDetails,
  ChillDetails,
  EntertainmentDetails,
  ExtrimDetails,
  FoodDetails,
  HealthDetails,
  LivingPlaceDetails,
  RentDetails,
  SecurityDetails,
} from 'src/ad/types/ad.details.type';
import { Category } from '../category/entities/category.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Utils } from 'src/utilities';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async seedCategoryAndSubcategory() {
    try {
      const data = {
        'Отдых': {
          'description': 'Туристическая тропа, грибное место, зона для отдыха и пикников, и т.д.',
          'imgPath': '/icons/chill.svg',
          'subcategories': [
            'Туристические тропы',
            'Грибные места',
            'Рыбные места',
            'Зоны для отдыха и пикников',
            'Игровые площади',
            'Пляжи и водоемы',
          ],
          'details': Object.keys(Reflect.construct(ChillDetails, [])),
        },
        'Жилье': {
          'description': 'Гостиницы, санатории, квартиры, команты, дома и коттеджи, и т.д.',
          'imgPath': '/icons/home.svg',
          'subcategories': [
            'Гостиницы',
            'Квартиры',
            'Комнаты',
            'Дома и Коттеджи',
            'Хостелы',
            'Гостевые дома',
            'Апарт-отели',
            'Мини-гостиницы',
          ],
          'details': Utils.getClassKeys(LivingPlaceDetails),
        },
        'Питание': {
          'description': 'Кафе, столовые, рестораны',
          'imgPath': '/icons/food.svg',
          'subcategories': ['Кафе', 'Рестораны', 'Столовые'],
          'details': Utils.getClassKeys(FoodDetails),
        },
        'Достопримечательности': {
          'description': 'Исторические и культурные объекты, музеи, памятники, парки, и т.д.',
          'imgPath': '/icons/wow.svg',
          'subcategories': ['Особые памятники и объекты культуры'],
          'details': Utils.getClassKeys(AttractionsDetails),
        },
        'Здоровье': {
          'description': 'Медицинские центры, санатории, SPA-салоны, фитнес-клубы, и т.д.',
          'imgPath': '/icons/health.svg',
          'subcategories': ['Оздоровление'],
          'details': Utils.getClassKeys(HealthDetails),
        },
        'Развлечения': {
          'description': 'Вечеринки и шоу, местный зоопарк, парк атракционов, экскурсии, и т.д.',
          'imgPath': '/icons/fun.svg',
          'subcategories': [
            'Вечеринки и шоу',
            'Зоопарки',
            'Парки аттракционов',
            'Развлекательные заведения',
            'Экскурсии',
            'Культурные мероприятия',
            'Сувенирные магазины',
          ],
          'details': Utils.getClassKeys(EntertainmentDetails),
        },
        'Экстрим': {
          'description': 'Активные виды спорта, альпинизм, парапланы, квадроциклы, и т.д.',
          'imgPath': '/icons/extrim.svg',
          'subcategories': ['Экстримальный отдых'],
          'details': Utils.getClassKeys(ExtrimDetails),
        },
        'Прокат': {
          'description': 'Автотранспорт, снаряжение, средства индивидуальной мобильности',
          'imgPath': '/icons/prokate.svg',
          'subcategories': ['Прокат и аренда снаряжения и оборудования'],
          'details': Utils.getClassKeys(RentDetails),
        },
        'Безопасность': {
          'description': 'Аптеки, банкоматы, консьерж-сервисы',
          'imgPath': '/icons/security.svg',
          'subcategories': ['Инфраструктура и безопасность'],
          'details': Utils.getClassKeys(SecurityDetails),
        },
      };

      for (const [categoryName, categoryData] of Object.entries(data)) {
        if (!(await this.categoryRepository.findOne({ where: { name: categoryName } }))) {
          const category = this.categoryRepository.create({
            name: categoryName,
            description: categoryData.description,
            imgPath: categoryData.imgPath,
            details: categoryData.details,
          });
          await this.categoryRepository.save(category);
          for (const subcategoryName of categoryData.subcategories) {
            if (!(await this.subcategoryRepository.findOne({ where: { name: subcategoryName } }))) {
              const subcategory = this.subcategoryRepository.create({
                name: subcategoryName,
                category: category,
              });
              await this.subcategoryRepository.save(subcategory);
            }
          }
        }
      }
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async seed() {
    await this.seedCategoryAndSubcategory();
  }
}
