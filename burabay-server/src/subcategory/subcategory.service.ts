import { Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Category } from 'src/category/entities/category.entity';
import { Utils } from 'src/utilities';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      const { categoryId, ...oF } = createSubcategoryDto;
      const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
      Utils.checkEntity(category, 'Категория не найдена');
      const newSubcategory = this.subcategoryRepository.create({ category: category, ...oF });
      return await this.subcategoryRepository.save(newSubcategory);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findAll() {
    try {
      return await this.subcategoryRepository.find();
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findOne(id: string, withAds: boolean = false) {
    try {
      let subcategory: Subcategory;
      if (!withAds) {
        subcategory = await this.subcategoryRepository.findOne({
          where: { id: id },
        });
      } else {
        subcategory = await this.subcategoryRepository.findOne({
          where: { id: id },
          relations: { ads: true },
        });
      }
      Utils.checkEntity(subcategory, 'Подкатегория не найдена');
      return subcategory;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
}
