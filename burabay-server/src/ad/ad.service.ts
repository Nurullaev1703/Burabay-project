import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { Repository } from 'typeorm';
import { Organization } from 'src/users/entities/organization.entity';
import { Utils } from 'src/utilities';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  /* Метод для создания Объявления. Принимает айти Категории (Подкатегории) и Организации. */
  async create(createAdDto: CreateAdDto) {
    try {
      const { organizationId, subcategoryId, ...otherFields } = createAdDto;

      const subcategory = await this.subcategoryRepository.findOne({
        where: { id: subcategoryId },
      });
      Utils.checkEntity(subcategory, 'Подкатегория не найдена');

      const organization = await this.organizationRepository.findOne({
        where: { id: organizationId },
      });
      Utils.checkEntity(organization, 'Организация не найдена');

      const newAd = this.adRepository.create({
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
      return await this.adRepository.find({
        relations: {
          organization: true,
          schedule: true,
          breaks: true,
          address: true,
        },
      });
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
        relations: {
          organization: true,
          schedule: true,
          breaks: true,
          address: true,
        },
      });
      Utils.checkEntity(ad, 'Объявления не найдены');
      return ad;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findAllFavorite(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { favorites: true },
      });
      Utils.checkEntity(user, 'Пользователь не найден');
      Utils.checkEntity(user.favorites, 'Пользователь не имеет любимых объявлений');
      return user.favorites;
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
          schedule: true,
          breaks: true,
          address: true,
          usersFavorited: true,
        },
      });
      Utils.checkEntity(ad, 'Объявление не найдено');
      const favCount = ad.usersFavorited.length;
      delete ad.usersFavorited;
      ad.views++;
      await this.adRepository.save(ad);
      return { ...ad, favCount };
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async addToFavorites(userId: string, adId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { favorites: true },
      });
      Utils.checkEntity(user, 'Пользователь не найден');

      const ad = await this.adRepository.findOne({ where: { id: adId } });
      Utils.checkEntity(ad, 'Объявление не найдено');

      // Проверяем, есть ли объявление уже в избранных
      if (!user.favorites.some((fav) => fav.id === ad.id)) {
        user.favorites.push(ad);
        await this.userRepository.save(user);
      }
      return JSON.stringify(HttpStatus.CREATED);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Метод для редактирования Объявления. Принимает айди Объявления. */
  async update(id: string, updateAdDto: UpdateAdDto) {
    try {
      const { subcategoryId, ...oF } = updateAdDto;
      const ad = await this.adRepository.findOne({ where: { id: id } });
      Utils.checkEntity(ad, 'Объявление не найдено');

      if (subcategoryId) {
        const subcategory = await this.subcategoryRepository.findOne({
          where: { id: subcategoryId },
        });
        Utils.checkEntity(subcategory, 'Категория не найдена');
        Object.assign(ad, { subcategory: subcategory, ...oF });
      } else {
        Object.assign(ad, oF);
      }
      return this.adRepository.save(ad);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Метод для удаления Объявления. */
  async remove(id: string) {
    try {
      const ad = await this.adRepository.findOne({ where: { id: id } });
      Utils.checkEntity(ad, 'Объявление не найдено');
      return await this.adRepository.remove(ad);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
}
