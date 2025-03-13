import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  /*
   * Метод для создания Адреса для Объявления или Организации.
   * - При указании adI, Адрес испольузется для Объявления с полем isMain: false.
   * - При отсутствии adId, создается основной Адрес для Профиля Организации с полем isMain: true.
   * - Для Профиля Организации должен быть только один Адрес с полем isMain: true.
   */
  async create(createAddressDto: CreateAddressDto) {
    try {
      let newAddress: Address;
      const { organizationId, adId, ...oF } = createAddressDto;
      const organization = await this.organizationRepository.findOne({
        where: { id: organizationId },
      });
      Utils.checkEntity(organization, 'Организация не найдена');

      if (adId) {
        // Создание для объявления.
        const ad = await this.adRepository.find({ where: { id: adId } });
        Utils.checkEntity(ad, 'Объявление не найдено');
        newAddress = this.addressRepository.create({
          ad: ad,
          organization: organization,
          isMain: false,
          ...oF,
        });
      } else {
        // Создания для Профиля Организации.
        newAddress = this.addressRepository.create({
          organization: organization,
          isMain: true,
          ...oF,
        });
      }

      await this.addressRepository.save(newAddress);
      return JSON.stringify(HttpStatus.CREATED);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /*
   * Метод для поиска всех объявлений, при необходимости по Организации.
   * - При получении orgId через Query, возвращает все Адреса с указанной Организацией.
   * - При отсутствии orgId, возвращает все Адреса.
   */
  async findAll(orgId?: string) {
    try {
      let address: Address[];
      if (orgId) {
        address = await this.addressRepository.find({
          where: { organization: { id: orgId } },
        });
      } else {
        address = await this.addressRepository.find();
      }
      Utils.checkEntity(address, 'Адреса не найдены');
      return address;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findOne(id: string) {
    try {
      const address = await this.addressRepository.findOne({ where: { id: id } });
      Utils.checkEntity(address, 'Адрес не найден');
      return address;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findOneByAd(adId: string) {
    try {
      const address = await this.addressRepository.findOne({ where: { ad: { id: adId } } });
      Utils.checkEntity(address, 'Адрес не найден');
      return address;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /*
   * Метод для обновления данных Адреса.
   * - При получении adId, добавляет указанное Объявление в массив Объявлений с этим Адресом.
   */
  async update(id: string, updateAddressDto: UpdateAddressDto) {
    try {
      const { adId, ...oF } = updateAddressDto;
      const address = await this.addressRepository.findOne({
        where: { id: id },
        relations: { ad: true },
      });
      Utils.checkEntity(address, 'Адрес не найден');
      if (adId) {
        const ad = await this.adRepository.findOne({ where: { id: adId } });
        Utils.checkEntity(ad, 'Объявление не найдено');
        address.ad.push(ad);
      }
      Object.assign(address, oF);
      await this.addressRepository.save(address);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async remove(id: string) {
    try {
      const address = await this.addressRepository.findOne({ where: { id: id } });
      Utils.checkEntity(address, 'Адрес не найден');
      await this.addressRepository.remove(address);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
}
