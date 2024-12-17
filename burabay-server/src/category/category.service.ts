import { Injectable } from '@nestjs/common';
import { Utils } from 'src/utilities';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /* Метод для получения всех Категорий */
  async findAll() {
    try {
      return await this.categoryRepository.find({ relations: { subcategories: true } });
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Метод для получения Категории по id */
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
}
