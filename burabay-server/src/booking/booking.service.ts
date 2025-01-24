import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CatchErrors, Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ad } from 'src/ad/entities/ad.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
  ) {}

  @CatchErrors()
  async create(createBookingDto: CreateBookingDto, tokenData: TokenData) {
    const user = await this.userRepository.findOne({ where: { id: tokenData.id } });
    const ad = await this.adRepository.findOne({ where: { id: createBookingDto.adId } });
    const newBooking = this.bookingRepository.create({ user: user, ad: ad, ...createBookingDto });
    await this.bookingRepository.save(newBooking);
    return JSON.stringify(HttpStatus.CREATED);
  }

  @CatchErrors()
  async findAllByUserId(tokenData: TokenData) {
    return await this.bookingRepository.find({
      where: { user: { id: tokenData.id } },
      relations: { ad: true },
    });
  }

  @CatchErrors()
  async findOne(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: id },
      relations: { ad: true },
    });
    Utils.checkEntity(booking, 'Бронирование не найдено');
    return booking;
  }

  @CatchErrors()
  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingRepository.findOne({ where: { id: id } });
    Utils.checkEntity(booking, 'Бронирование не найдено');
    Object.assign(booking, updateBookingDto);
    this.bookingRepository.save(booking);
    return JSON.stringify(HttpStatus.OK);
  }

  @CatchErrors()
  async remove(id: string) {
    const booking = await this.bookingRepository.findOne({ where: { id: id } });
    Utils.checkEntity(booking, 'Бронирование не найдено');
    await this.bookingRepository.remove(booking);
    return JSON.stringify(HttpStatus.OK);
  }
}
