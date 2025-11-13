import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingBanDateDto } from './dto/create-booking-ban-date.dto';
import { UpdateBookingBanDateDto } from './dto/update-booking-ban-date.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Repository } from 'typeorm';
import { BookingBanDate } from './entities/booking-ban-date.entity';
import { CatchErrors, Utils } from 'src/utilities';
import { User } from 'src/users/entities/user.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';

@Injectable()
export class BookingBanDateService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(BookingBanDate)
    private readonly bookingBanDateRepository: Repository<BookingBanDate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  @CatchErrors()
  async create(createBookingBanDateDto: CreateBookingBanDateDto[], tokenData: TokenData) {
    const currentUser = await this.#checkRole(tokenData);
    const newBookingBanDates = [];
    for (const createBookingBanDate of createBookingBanDateDto) {
      const { adId, ...oF } = createBookingBanDate;
      const ad = await this.adRepository.findOne({
        where: { id: adId },
        relations: { organization: { user: true } }
      });
      Utils.checkEntity(ad, 'Объявление не найдено');

      // Проверяем права доступа для бизнес-пользователей
      if (currentUser.role === ROLE_TYPE.BUSINESS)
        await this.#checkOrganization(currentUser, ad.organization.user);


      const newBookingBanDate = this.bookingBanDateRepository.create({
        ad: ad,
        ...oF,
      });
      newBookingBanDates.push(newBookingBanDate);
    }
    const savedDates = await this.bookingBanDateRepository.save(newBookingBanDates);
    // Возвращаем созданные записи с ID вместо просто статуса
    return savedDates;
  }

  async findAllByAd(adId: string) {
    try {
      const bbd = await this.bookingBanDateRepository.find({
        where: { ad: { id: adId } },
      });
      Utils.checkEntity(bbd, 'Запрещенные для брони даты не найдены');
      return bbd;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async update(id: string, updateBookingBanDateDto: UpdateBookingBanDateDto, tokenData: TokenData) {
    try {
      const currentUser = await this.#checkRole(tokenData);

      const bbd = await this.bookingBanDateRepository.findOne({ where: { id: id }, relations: { ad: { organization: { user: true } } } });
      Utils.checkEntity(bbd, 'Запрещенная для брони дата не найдена');
      if (currentUser.role === ROLE_TYPE.BUSINESS)
        await this.#checkOrganization(currentUser, bbd.ad.organization.user);
      Object.assign(bbd, updateBookingBanDateDto);
      await this.bookingBanDateRepository.save(bbd);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async remove(id: string, tokenData: TokenData) {
    try {
      const currentUser = await this.#checkRole(tokenData);

      const bbd = await this.bookingBanDateRepository.findOne({ where: { id: id }, relations: { ad: { organization: { user: true } } } });
      Utils.checkEntity(bbd, 'Запрещенная для брони дата не найдена');
      if (currentUser.role === ROLE_TYPE.BUSINESS)
        await this.#checkOrganization(currentUser, bbd.ad.organization.user);
      await this.bookingBanDateRepository.remove(bbd);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async #checkRole(tokenData: TokenData) {
    const user = await this.userRepository.findOne({ where: { id: tokenData.id }, select: { role: true } });
    Utils.checkEntity(user, 'Пользователь не найден');
    if (user.role !== ROLE_TYPE.ADMIN && user.role !== ROLE_TYPE.BUSINESS)
      throw new HttpException('Недостаточно прав для создания запрещенной даты', HttpStatus.FORBIDDEN);
    return user;
  }
  async #checkOrganization(currentUser: User, orgUser: User) {
    if (currentUser.id !== orgUser.id)
      throw new HttpException('Недостаточно прав для редактирования этой даты', HttpStatus.FORBIDDEN);
  }
}
