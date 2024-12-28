import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { AdFilter } from 'src/ad/types/ad.filter';
import { Category } from 'src/category/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MainPageService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async getMainPage(filter?: AdFilter) {
    let whereOptions = {};
    if (filter.adName) {
      whereOptions = { ...whereOptions, title: filter.adName };
    }
    if (filter.category) {
      whereOptions = {
        ...whereOptions,
        subcategory: {
          category: { name: filter.category },
        },
      };
    }
    const result = await Promise.all([
      this.categoryRepository.find(),
      this.adRepository.find({
        where: whereOptions,
        relations: { organization: true, subcategory: { category: true }, address: true },
        // take: 10, //TODO Поменять кол-во объявлений на Главной старнице
      }),
    ]);
    return {
      'categories': result[0],
      'ads': result[1],
    };
  }
}
