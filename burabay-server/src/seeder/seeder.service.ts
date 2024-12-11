import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Category } from 'src/category/entities/category.entity';
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
        'Отдых': [
          'Туристические тропы',
          'Грибные места',
          'Рыбные места',
          'Зоны для отдыха и пикников',
          'Игровые площади',
          'Пляжи и водоемы',
        ],
        'Жилье': [
          'Гостиницы',
          'Квартиры',
          'Комнаты',
          'Дома и Коттеджи',
          'Хостелы',
          'Гостевые дома',
          'Апарт-отели',
          'Мини-гостиницы',
        ],
        'Питание': ['Кафе', 'Рестораны', 'Столовые'],
        'Достопримечательности': ['Особые памятники и объекты культуры'],
        'Здоровье': ['Оздоровление'],
        'Развлечения': [
          'Вечеринки и шоу',
          'Зоопарки',
          'Парки аттракционов',
          'Развлекательные заведения',
          'Экскурсии',
          'Культурные мероприятия',
          'Сувенирные магазины',
        ],
        'Экстрим': ['Экстримальный отдых'],
        'Прокат': ['Прокат и аренда снаряжения и оборудования'],
        'Безопасность': ['Инфраструктура и безопасность'],
      };

      for (const [categoryName, subcategoryNames] of Object.entries(data)) {
        if (!(await this.categoryRepository.findOne({ where: { name: categoryName } }))) {
          const category = this.categoryRepository.create({ name: categoryName });
          await this.categoryRepository.save(category);
          for (const subcategoryName of subcategoryNames) {
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
  // TODO Потом удалить.
  async seedAds() {
    try {
      let org: Organization;
      if (!(await this.orgRepository.findOne({ where: { name: 'Тестовая организация' } }))) {
        org = await this.orgRepository.create({
          imgUrl: 'img_link',
          name: 'Тестовая организация',
          address: 'Pavlodar',
          isConfirmed: true
        });
        await this.orgRepository.save(org);
      } else {
        org = await this.orgRepository.findOne({ where: { name: 'Тестовая организация' } });
      }

      const subcategories = [
        'Туристические тропы',
        'Грибные места',
        'Игровые площади',
        'Гостиницы',
        'Квартиры',
        'Комнаты',
        'Кафе',
        'Рестораны',
        'Столовые',
      ];
      for (let i = 0; i < 9; i++) {
        const subcategory = await this.subcategoryRepository.findOne({
          where: { name: subcategories[i] },
        });
        if (!(await this.adRepository.findOne({ where: { title: 'Объявление №' + i } }))) {
          const ad = this.adRepository.create({
            title: 'Объявление №' + i,
            description: 'Описание объявления №' + i,
            price: Math.floor(Math.random() * 1000),
            images: ['images_path'],
            youtubeLink: 'youtube_link',
            address: 'Pavlodar',
            phoneNumber: '+77077045632',
            subcategory: subcategory,
            details: { type: 'livingPlace', 'rooms': 3, wifi: true },
            organization: org,
          });
          await this.adRepository.save(ad);
        }
      }
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
  async seed() {
    await this.seedCategoryAndSubcategory();
    await this.seedAds();
  }
}
