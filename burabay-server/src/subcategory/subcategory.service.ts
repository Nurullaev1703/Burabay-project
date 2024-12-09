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
      Utils.check(category, 'Категория не найдена');
      const newSubcategory = this.subcategoryRepository.create({ category: category, ...oF });
      return await this.subcategoryRepository.save(newSubcategory);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  findAll() {
    return `This action returns all subcategory`;
  }

  findOne(id: string) {
    return `This action returns a #${id} subcategory`;
  }
}
