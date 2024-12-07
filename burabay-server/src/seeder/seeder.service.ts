import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Category } from 'src/category/entities/category.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { User } from 'src/users/entities/user.entity';
import { Utils } from 'src/utilities';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async seedCategory() {
    try {
      const names = [
        'Отдых',
        'Жилье',
        'Питание',
        'Достопримечательности',
        'Здоровье',
        'Развлечения',
        'Экстрим',
        'Прокат',
        'Безопасность',
      ];

      for (const name of names) {
        const category = this.categoryRepository.create({ name });
        await this.categoryRepository.save(category);
      }
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async seed() {
    await this.seedCategory();
  }
}
