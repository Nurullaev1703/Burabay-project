import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CatchErrors, Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { BookingFilter, BookingStatus, PaymentType } from './types/booking.types';
import { Notification } from 'src/notification/entities/notification.entity';

@Injectable()
export class BookingService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
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
  async findAllByOrgId(tokerData: TokenData, filter?: BookingFilter) {
    let whereOptions: any = {
      ad: { organization: { user: { id: tokerData.id } } },
    };
    if (filter.canceled) {
      whereOptions = {
        ...whereOptions,
        status: BookingStatus.CANCELED,
      };
    }
    if (filter.onSidePayment !== filter.onlinePayment) {
      if (filter.onSidePayment) {
        whereOptions = {
          ...whereOptions,
          paymentType: PaymentType.CASH,
        };
      }
      if (filter.onlinePayment) {
        whereOptions = {
          ...whereOptions,
          paymentType: PaymentType.ONLINE,
        };
      }
    }

    const bookings = await this.bookingRepository.find({
      where: whereOptions,
      relations: { user: true, ad: { organization: true } },
    });

    const groups = [];

    for (const b of bookings) {
      // Создаём заголовок.
      const header = b.status === BookingStatus.IN_PROCESS ? 'In process' : b.date;

      if (b.status === BookingStatus.CANCELED) {
        // Если бронь отменена, то добавляет _ к времени
        b.time = b.time + '_';
      }

      let group = groups.find((g) => g.header === header);

      if (!group) {
        group = { header, ads: [] };
        groups.push(group);
      }

      let adGroup = group.ads.find((ad) => ad.title === b.ad.title);

      if (!adGroup) {
        adGroup = {
          title: b.ad.title,
          ad_id: b.ad.id,
          img: b.ad.images[0],
          times: [],
        };
        group.ads.push(adGroup);
      }

      if (b.ad.isBookable) {
        adGroup.times.push(`с ${b.dateStart} до ${b.dateEnd}`);
      } else {
        adGroup.times.push(b.time);
      }
    }

    return groups;
  }

  @CatchErrors()
  async getAllByAdId(adId: string, date: string, filter?: BookingFilter) {
    const ad = await this.adRepository.findOne({ where: { id: adId } });
    let whereOptions = {};
    Utils.checkEntity(ad, 'Объявление не найдено');
    if (date === 'In process') {
      whereOptions = { ad: { id: adId }, status: BookingStatus.IN_PROCESS };
    } else {
      if (ad.isBookable) {
        whereOptions = { ad: { id: adId }, dateStart: date };
      } else {
        whereOptions = { ad: { id: adId }, date: date };
      }
    }

    if (filter.canceled) {
      whereOptions = {
        ...whereOptions,
        status: BookingStatus.CANCELED,
      };
    }
    if (filter.onSidePayment !== filter.onlinePayment) {
      if (filter.onSidePayment) {
        whereOptions = {
          ...whereOptions,
          paymentType: PaymentType.CASH,
        };
      }
      if (filter.onlinePayment) {
        whereOptions = {
          ...whereOptions,
          paymentType: PaymentType.ONLINE,
        };
      }
    }

    const bookings = await this.bookingRepository.find({
      where: whereOptions,
      relations: { ad: true, user: true },
    });

    const ad_bookins = [];
    if (ad.isBookable) {
      for (const b of bookings) {
        ad_bookins.push({
          dateStart: b.dateStart,
          dateEnd: b.dateEnd,
          time: b.time,
          name: b.name,
          avatar: b.user.picture,
          user_id: b.user.id,
          user_number: b.phoneNumber,
          payment_method: b.paymentType,
          isPaid: b.isPaid,
          price: b.ad.price,
          status: b.status,
        });
      }
    } else {
      for (const b of bookings) {
        ad_bookins.push({
          time: b.time,
          name: b.name,
          avatar: b.user.picture,
          user_id: b.user.id,
          user_number: b.phoneNumber,
          payment_method: b.paymentType,
          isPaid: b.isPaid,
          price: b.ad.price,
          status: b.status,
        });
      }
    }

    return {
      title: bookings[0].ad.title,
      image: bookings[0].ad.images[0],
      date: date,
      bookings: ad_bookins,
    };
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
    return await this.dataSource.transaction(async (manager) => {
      const booking = await manager.findOne(Booking, {
        where: { id: id },
        relations: { user: true, ad: true },
      });
      Utils.checkEntity(booking, 'Бронирование не найдено');
      await manager.remove(booking);
      const notification = await manager.create(Notification, {
        user: await this.userRepository.findOne({ where: { id: booking.user.id } }),
        message: `Ваша бронь на объявление "${booking.ad.title}" была отменена`,
      });
      await manager.save(notification);
      return JSON.stringify(HttpStatus.OK);
    });
  }
}
