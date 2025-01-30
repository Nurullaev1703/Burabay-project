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
      relations: { user: true, ad: { organization: true, subcategory: { category: true } } },
    });

    const groups = [];

    for (const b of bookings) {
      // Создаём заголовок.
      // Вернуть, когда будет этап со статусом "В процессе".
      // const header = b.status === BookingStatus.IN_PROCESS ? 'In process' : b.date;
      const today = new Date();
      const [day, month, year] = b.date.split('.'); // Достать день, месяц, год из строки даты.
      const date = new Date(`${year}-${month}-${day}`); // Тип даты на основе даты брони.
      let header = b.date;
      // Если date и today это один день, то изменить header на "Сегодня".
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        header = 'Сегодня';
      }
      // Если date это следующий день, то изменить header на "Завтра".
      if (date.getDate() === today.getDate() + 1) {
        header = 'Завтра';
      }

      if (b.status === BookingStatus.CANCELED) {
        // Если бронь отменена, то добавляет _ к времени.
        b.time = b.time + '_';
        b.dateEnd = b.dateEnd + '_';
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
      // Является ли объявление арендой.
      const isRent =
        b.ad.subcategory.category.name === 'Жилье' || b.ad.subcategory.category.name === 'Прокат';

      if (isRent) {
        adGroup.times.push(`с ${b.date} до ${b.dateEnd}`);
      } else {
        adGroup.times.push(b.time);
      }
    }

    return groups;
  }

  @CatchErrors()
  async getAllByAdId(adId: string, date: string, filter?: BookingFilter) {
    const ad = await this.adRepository.findOne({
      where: { id: adId },
      relations: { subcategory: { category: true } },
    });

    const isRent =
      ad.subcategory.category.name === 'Жилье' || ad.subcategory.category.name === 'Прокат';
    let findDate;
    if (date === 'Сегодня') {
      const today = new Date();
      findDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    } else if (date === 'Завтра') {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      findDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    } else {
      findDate = date;
    }
    Utils.checkEntity(ad, 'Объявление не найдено');

    let whereOptions: any = { ad: { id: adId }, date: findDate };

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
    if (bookings.length === 0) {
      return [];
    }
    const ad_bookins = [];
    if (isRent) {
      for (const b of bookings) {
        ad_bookins.push({
          bookingId: b.id,
          date: b.date,
          dateEnd: b.dateEnd,
          time: b.time,
          name: b.name,
          avatar: b.user.picture,
          user_number: b.phoneNumber,
          rate: b.isChildRate ? 'Детский' : 'Взрослый',
          payment_method: b.paymentType,
          isPaid: b.isPaid,
          price: b.ad.price,
          status: b.status,
          type: 'Аренда',
        });
      }
    } else {
      for (const b of bookings) {
        ad_bookins.push({
          bookingId: b.id,
          time: b.time,
          name: b.name,
          avatar: b.user.picture,
          user_number: b.phoneNumber,
          payment_method: b.paymentType,
          rate: b.isChildRate ? 'Детский' : 'Взрослый',
          isPaid: b.isPaid,
          price: b.ad.price,
          status: b.status,
          type: 'Услуга',
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
      relations: { ad: { organization: true }, user: true },
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
        message: `Ваша бронь на объявление "${booking.ad.title}" была удалена`,
      });
      await manager.save(notification);
      return JSON.stringify(HttpStatus.OK);
    });
  }

  @CatchErrors()
  async bookingCancel(id: string) {
    return await this.dataSource.transaction(async (manager) => {
      const booking = await manager.findOne(Booking, {
        where: { id: id },
        relations: { user: true, ad: true },
      });
      Utils.checkEntity(booking, 'Бронирование не найдено');
      booking.status = BookingStatus.CANCELED;
      await manager.save(booking);
      const notification = await manager.create(Notification, {
        user: await this.userRepository.findOne({ where: { id: booking.user.id } }),
        message: `Ваша бронь на объявление "${booking.ad.title}" была удалена`,
      });
      await manager.save(notification);
      return JSON.stringify(HttpStatus.OK);
    });
  }
}
