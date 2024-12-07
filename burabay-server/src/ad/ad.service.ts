import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { Utils } from 'src/utilities';

@Injectable()
export class AdService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    // TODO Удалить после 29 декабря.
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    // TODO Раскомментить после 29 декабря.
    // @InjectRepository(Subcategory)
    // private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  /* Метод для создания Объявления. Принимает айти Категории (Подкатегории) и Организации. */
  async create(createAdDto: CreateAdDto) {
    try {
      // TODO Поменять категорию на подкатегорию после 29 декабря.
      const { categoryId, organization_id: organizationId, ...otherFields } = createAdDto;
      const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
      Utils.check(category, 'Категория не найдена');
      const organization = await this.organizationRepository.findOne({
        where: { id: organizationId },
      });
      Utils.check(organization, 'Организация не найдена');
      const newAd = this.adRepository.create({
        category: category,
        organization: organization,
        ...otherFields,
      });
      return this.adRepository.save(newAd);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Метод для получения всех Объявлений. */
  async findAll() {
    try {
      return await this.adRepository.find();
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Метод для получения всех Объявлений у Организации */
  async findAllByOrg(orgId: string) {
    try {
      const ad = await this.adRepository.find({
        where: {
          organization: { id: orgId },
        },
      });
      Utils.check(ad, 'Объявления не найдены');
      return ad;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Метод для получения одного Объявления по id. */
  async findOne(id: string) {
    try {
      const ad = await this.adRepository.findOne({
        where: { id: id },
        relations: {
          organization: true,
        },
      });
      Utils.check(ad, 'Объявление не найдено');
      return ad;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Метод для редактирования Объявления. Принимает айди Объявления. */
  async update(id: string, updateAdDto: UpdateAdDto) {
    try {
      const { categoryId, ...oF } = updateAdDto;
      const ad = await this.adRepository.findOne({ where: { id: id } });
      Utils.check(ad, 'Объявление не найдено');
      const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
      Utils.check(category, 'Категория не найдена');
      Object.assign(ad, { category: category, ...oF });
      return this.adRepository.save(ad);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Метод для удаления Объявления. */
  async remove(id: string) {
    try {
      const ad = await this.adRepository.findOne({ where: { id: id } });
      if (!ad) throw new HttpException('Объявление не найдено', HttpStatus.NOT_FOUND);
      return await this.adRepository.remove(ad);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
}
