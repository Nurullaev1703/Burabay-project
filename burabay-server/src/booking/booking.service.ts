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
import { NotificationType } from 'src/notification/types/notification.type';

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

  /* Создание Бронирования. */
  @CatchErrors()
  async create(createBookingDto: CreateBookingDto, tokenData: TokenData) {
    const { adId, dateStart: dateStartDto, dateEnd: dateEndDto, ...oF } = createBookingDto;
    const user = await this.userRepository.findOne({ where: { id: tokenData.id } });
    const ad = await this.adRepository.findOne({
      where: { id: adId },
      relations: { subcategory: { category: true } },
    });

    // Преобразовать строковые даты из DTO в тип js даты.
    let dateStart: Date, dateEnd: Date;
    if (dateStartDto) {
      dateStart = Utils.stringDateToDate(dateStartDto);
    }
    if (dateEndDto) {
      dateEnd = Utils.stringDateToDate(dateEndDto);
    }

    // Создание брони.
    const newBooking = this.bookingRepository.create({
      user: user,
      ad: ad,
      dateStart: dateStart ? dateStart : null,
      dateEnd: dateEnd ? dateEnd : null,
      ...oF,
    });

    // Является ли объявление арендой.
    const isRent =
      ad.subcategory.category.name === 'Жилье' || ad.subcategory.category.name === 'Прокат';

    // Вычисление общей стоимости аренды, в случае если это аренда и если начало и конец аренды указан.
    if (isRent) {
      const days = (dateEnd.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
      newBooking.totalPrice = days * (createBookingDto.isChildRate ? ad.priceForChild : ad.price);
    } else {
      newBooking.totalPrice = createBookingDto.isChildRate ? ad.priceForChild : ad.price;
    }

    // Сохранение
    await this.bookingRepository.save(newBooking);
    return JSON.stringify(HttpStatus.CREATED);
  }

  /* Получение всех бронирований Пользователя. */
  @CatchErrors()
  async findAllByUserId(tokenData: TokenData, filter?: BookingFilter) {
    const whereOptions: Record<string, any> = {
      user: { id: tokenData.id },
    };

    // Фильтр отмененных броней.
    if (filter?.canceled) {
      whereOptions.status = BookingStatus.CANCELED;
    }

    // Фильтр по типу оплаты.
    if (filter?.onSidePayment !== filter?.onlinePayment) {
      if (filter?.onSidePayment) whereOptions.paymentType = PaymentType.CASH;
      if (filter?.onlinePayment) whereOptions.paymentType = PaymentType.ONLINE;
    }

    const bookings = await this.bookingRepository.find({
      where: whereOptions,
      relations: { user: true, ad: { organization: true, subcategory: { category: true } } },
    });

    // Группировка по дате.
    const groups: { header: string; ads: any[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Обнуляем время для корректного сравнения.

    for (const b of bookings) {
      const isRent = ['Жилье', 'Прокат'].includes(b.ad.subcategory.category.name);
      let date: Date;
      let header: string;

      if (isRent) {
        date = b.dateStart;
        header = b.dateStart.toLocaleDateString('ru-RU');
      } else {
        const [day, month, year] = b.date.split('.').map(Number);
        date = new Date(year, month - 1, day);
        header = b.date;
      }

      // Проверяем "Сегодня" и "Завтра".
      const diffDays = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 0) header = 'Сегодня';
      if (diffDays === 1) header = 'Завтра';

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

      let newTimeField;
      if (isRent) {
        newTimeField = `с ${b.dateStart.toLocaleDateString('ru-RU')} до ${b.dateEnd.toLocaleDateString('ru-RU')}`;
      } else {
        if (b.time) newTimeField = b.time;
        else newTimeField = b.date;
      }
      const newTime = {
        time: newTimeField,
        status: b.status,
        price: b.totalPrice,
        isPaid: b.isPaid,
        paymentType: b.paymentType,
      };
      adGroup.times.push(newTime);
    }

    return groups;
  }

  /* Получить все бронирования Организации. */
  @CatchErrors()
  async findAllByOrgId(tokenData: TokenData, filter?: BookingFilter) {
    let whereOptions: object = {
      ad: { organization: { user: { id: tokenData.id } } },
    };

    // Фильтр по отмененным броням.
    if (filter.canceled) {
      whereOptions = {
        ...whereOptions,
        status: BookingStatus.CANCELED,
      };
    }
    // Фильтр по типу оплаты.
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
      const isRent =
        b.ad.subcategory.category.name === 'Жилье' || b.ad.subcategory.category.name === 'Прокат';

      const today = new Date();
      let date: Date;
      let header: string;

      if (isRent) {
        // const day = b.dateStart.getDay();
        // const month = b.dateStart.getMonth();
        // const year = b.dateStart.getFullYear();
        date = b.dateStart;
        // date = new Date(`${year}-${month}-${day}`); // Тип даты на основе даты брони.
        // header = `${day}.${month + 1}.${year}`;
        header = b.dateStart.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        });
      } else {
        const [day, month, year] = b.date.split('.');
        date = new Date(`${year}-${month}-${day}`);
        header = b.date;
      }

      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        header = 'Сегодня';
      }

      if (date.getDate() === today.getDate() + 1) {
        header = 'Завтра';
      }

      // if (b.status === BookingStatus.CANCELED) {
      //   isRent ? (b.dateEnd = b.dateEnd + '_') : (b.date = b.date + '_');
      // }

      let group = groups.find((g) => g.header === header);

      if (!group) {
        group = { header, ads: {} };
        groups.push(group);
      }

      if (!group.ads[b.ad.id]) {
        group.ads[b.ad.id] = {
          ad_id: b.ad.id,
          title: b.ad.title,
          status: b.status,
          img: b.ad.images[0],
          times: [],
        };
      }

      if (isRent) {
        group.ads[b.ad.id].times.push(
          `с ${b.dateStart.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })} до ${b.dateEnd.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}`,
        );
      } else {
        if (b.time) group.ads[b.ad.id].times.push(b.time);
        else group.ads[b.ad.id].times.push(b.date);
      }
    }

    return groups.map((group) => ({
      header: group.header,
      ads: Object.values(group.ads),
    }));
  }

  /* Получить все брони на объявление.  */
  @CatchErrors()
  async getAllByAdId(adId: string, date: string, filter?: BookingFilter) {
    const ad = await this.adRepository.findOne({
      where: { id: adId },
      relations: { subcategory: { category: true } },
    });
    Utils.checkEntity(ad, 'Объявление не найдено');

    // Объявление это аренда?
    const isRent =
      ad.subcategory.category.name === 'Жилье' || ad.subcategory.category.name === 'Прокат';

    let findDate: string;

    // Получение даты для поиска
    if (date === 'Сегодня') {
      const today = new Date();
      findDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    } else if (date === 'Завтра') {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      findDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    } else {
      const parts = date.split('.');
      if (parts.length === 3 && parts[2].length === 2) {
        parts[2] = `20${parts[2]}`; // Добавляем "20" перед годом
      }
      findDate = parts.join('.');
    }
    Utils.checkEntity(ad, 'Объявление не найдено');
    let whereOptions: any;
    if (isRent) {
      whereOptions = { ad: { id: adId }, dateStart: Utils.stringDateToDate(findDate) };
    } else {
      whereOptions = { ad: { id: adId }, date: findDate };
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
    if (bookings.length === 0) {
      return [];
    }
    const ad_bookins = [];
    if (isRent) {
      for (const b of bookings) {
        ad_bookins.push({
          bookingId: b.id,
          dateStart: Utils.dateToString(b.dateStart),
          dateEnd: Utils.dateToString(b.dateEnd),
          days: (b.dateEnd.getTime() - b.dateStart.getTime()) / (1000 * 60 * 60 * 24),
          time: b.time,
          name: b.name,
          avatar: b.user.picture,
          user_number: b.phoneNumber,
          rate: b.isChildRate ? 'Детский' : 'Взрослый',
          payment_method: b.paymentType,
          isPaid: b.isPaid,
          price: b.totalPrice,
          status: b.status,
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
          price: b.totalPrice,
          status: b.status,
        });
      }
    }

    return {
      title: bookings[0].ad.title,
      image: bookings[0].ad.images[0],
      type: isRent ? 'Аренда' : 'Услуга',
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
        users: [{ id: booking.user.id }],
        type: NotificationType.NEGATIVE,
        message: `Ваша бронь на объявление "${booking.ad.title}" была удалена`,
        createdAt: new Date(),
      });
      await manager.save(notification);
      return JSON.stringify(HttpStatus.OK);
    });
  }
}
