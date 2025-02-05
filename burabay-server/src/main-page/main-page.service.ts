import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { AdFilter } from 'src/ad/types/ad.filter';
import { Category } from 'src/category/entities/category.entity';
import stringSimilarity from 'string-similarity-js';
import { Repository } from 'typeorm';

@Injectable()
export class MainPageService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async getMainPageAnnouncements(filter?: AdFilter) {
    let whereOptions = {};
    if (filter.category) {
      whereOptions = {
        ...whereOptions,
        subcategory: {
          category: { name: filter.category },
        },
      };
    }
    const announcements = await this.adRepository.find({
      where: whereOptions,
      relations: { organization: true, subcategory: { category: true }, address: true },
      order: {
        createdAt: 'DESC',
      },
      skip: filter.offset || 0,
      take: filter.limit || 10,
    });
    return filter.adName ? this._searchAd(filter.adName, announcements) : announcements
  }

  async getMainPageCategories() {
    return await this.categoryRepository.find();
  }

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
