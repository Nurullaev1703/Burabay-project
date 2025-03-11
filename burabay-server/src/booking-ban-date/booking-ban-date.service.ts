import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingBanDateDto } from './dto/create-booking-ban-date.dto';
import { UpdateBookingBanDateDto } from './dto/update-booking-ban-date.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Repository } from 'typeorm';
import { BookingBanDate } from './entities/booking-ban-date.entity';
import { CatchErrors, Utils } from 'src/utilities';

@Injectable()
export class BookingBanDateService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(BookingBanDate)
    private readonly bookingBanDateRepository: Repository<BookingBanDate>,
  ) {}

  @CatchErrors()
  async create(createBookingBanDateDto: CreateBookingBanDateDto[]) {
    const newBookingBanDates = [];
    for (const createBookingBanDate of createBookingBanDateDto) {
      const { adId, ...oF } = createBookingBanDate;
      const ad = await this.adRepository.findOneBy({ id: adId });
      Utils.checkEntity(ad, 'Объявление не найдено');
      const newBookingBanDate = this.bookingBanDateRepository.create({
        ad: ad,
        ...oF,
      });
      newBookingBanDates.push(newBookingBanDate);
    }
    await this.bookingBanDateRepository.save(newBookingBanDates);
    return JSON.stringify(HttpStatus.CREATED);
  }

  async findAllByAd(adId: string) {
    try {
      const bbd = await this.bookingBanDateRepository.find({
        where: { ad: { id: adId }, isByBooking: false },
      });
      Utils.checkEntity(bbd, 'Запрещенные для брони даты не найдены');
      return bbd;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async update(id: string, updateBookingBanDateDto: UpdateBookingBanDateDto) {
    try {
      const bbd = await this.bookingBanDateRepository.findOne({ where: { id: id } });
      Utils.checkEntity(bbd, 'Запрещенная для брони дата не найдена');
      Object.assign(bbd, updateBookingBanDateDto);
      await this.bookingBanDateRepository.save(bbd);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async remove(id: string) {
    try {
      const bbd = await this.bookingBanDateRepository.findOne({ where: { id: id } });
      Utils.checkEntity(bbd, 'Запрещенная для брони дата не найдена');
      await this.bookingBanDateRepository.remove(bbd);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
}
