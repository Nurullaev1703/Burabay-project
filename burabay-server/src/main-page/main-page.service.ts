import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
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
  async getMainPage() {
    const result = await Promise.all([
      this.categoryRepository.find(),
      this.adRepository.find({
        relations: { organization: true, subcategory: { category: true } },
        // take: 10, //TODO Поменять кол-во объявлений на Главной старнице
      }),
    ]);
    return {
      'categories': result[0],
      'ads': result[1],
    };
  }
}
