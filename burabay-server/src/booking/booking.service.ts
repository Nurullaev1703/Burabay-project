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
import { NotificationType } from 'src/notification/types/notification.type';
import { BookingBanDateService } from 'src/booking-ban-date/booking-ban-date.service';
import { CreateBookingBanDateDto } from 'src/booking-ban-date/dto/create-booking-ban-date.dto';
import { BookingBanDate } from 'src/booking-ban-date/entities/booking-ban-date.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class BookingService {
  constructor(
    private dataSource: DataSource,
    private bookingBanDateService: BookingBanDateService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(BookingBanDate)
    private readonly bookingBanDateRepository: Repository<BookingBanDate>,
    private readonly notificationService: NotificationService,
  ) {}

  /* Создание Бронирования. */
  @CatchErrors()
  async create(createBookingDto: CreateBookingDto, tokenData: TokenData) {
    return await this.dataSource.transaction(async () => {
      const { adId, dateStart: dateStartDto, dateEnd: dateEndDto, ...oF } = createBookingDto;
      const user = await this.userRepository.findOne({ where: { id: tokenData.id } });
      const ad = await this.adRepository.findOne({
        where: { id: adId },
        relations: { subcategory: { category: true }, organization: { user: true } },
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
      const isRent = ad.subcategory.category.name === 'Жилье';

      // Вычисление общей стоимости аренды
      if (isRent) {
        const days = (dateEnd.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24);
        newBooking.totalPrice =
          days * (ad.price + (createBookingDto.isChildRate ? ad.priceForChild : 0));
      } else {
        newBooking.totalPrice = ad.price + (createBookingDto.isChildRate ? ad.priceForChild : 0);
      }

      // Сохранение
      await this.bookingRepository.save(newBooking);

      // Проверить наличие запрета даты бронирвоания.
      // Если на весь день, то ничего не делать.
      // Если не на весь день, до добавить время к запрету.
      // Если запрета нет, то создать его на нужное время.
      if (!isRent) {
        const findBookingBanDate = await this.bookingBanDateRepository.findOne({
          where: {
            ad: { id: adId },
            date: oF.date,
          },
        });
        // Запрет есть.
        if (findBookingBanDate) {
          // Запрет не на весь день.
          if (!findBookingBanDate.allDay) findBookingBanDate.times.push(oF.time);
          await this.bookingBanDateRepository.save(findBookingBanDate);
        } else {
          // Запрета нет. Создать его.
          const bookingBanDateDto: CreateBookingBanDateDto = {
            adId: adId,
            date: oF.date,
            times: ad.isFullDay ? null : [oF.time],
            allDay: ad.isFullDay,
            isByBooking: true,
          };
          await this.bookingBanDateService.create([bookingBanDateDto]);
        }
      }
      const notificationDto = {
        email: ad.organization.user.email,
        title: '',
        type: NotificationType.POSITIVE,
        message: `Новая бронь на объявление "${ad.title}"`,
      };
      await this.notificationService.createForUser(notificationDto);
      return JSON.stringify(HttpStatus.CREATED);
    });
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
      const isRent = ['Жилье'].includes(b.ad.subcategory.category.name);
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
      const isRent = b.ad.subcategory.category.name === 'Жилье';

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
  async getAllByAdId(adId: string, date: string, tokenData: TokenData, filter?: BookingFilter) {
    // Получить роль пользователя через Токен.
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      select: {
        id: true,
        role: true,
      },
    });
    Utils.checkEntity(user, 'Пользователь не найден');

    // Получение объявления
    const ad = await this.adRepository.findOne({
      where: { id: adId },
      relations: { subcategory: { category: true } },
    });
    Utils.checkEntity(ad, 'Объявление не найдено');

    // Объявление это аренда?
    const isRent = ad.subcategory.category.name === 'Жилье';

    // Получение даты для поиска
    let findDate: string;
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

    let whereOptions: any;
    // Если Турист, то получить только свои брони.
    if (user.role === ROLE_TYPE.TOURIST) {
      whereOptions = { user: { id: tokenData.id } };
    }
    if (isRent) {
      whereOptions = {
        ...whereOptions,
        ad: { id: adId },
        dateStart: Utils.stringDateToDate(findDate),
      };
    } else {
      whereOptions = { ...whereOptions, ad: { id: adId }, date: findDate };
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
      const notificationDto = {
        email: booking.user.email,
        title: '',
        type: NotificationType.NEGATIVE,
        message: `Ваша бронь на объявление "${booking.ad.title}" была удалена`,
      };
      await this.notificationService.createForUser(notificationDto);
      return JSON.stringify(HttpStatus.OK);
    });
  }

  @CatchErrors()
  async bookingCancel(id: string, tokenData: TokenData) {
    return await this.dataSource.transaction(async (manager) => {
      const booking = await manager.findOne(Booking, {
        where: { id: id },
        relations: { user: true, ad: { organization: { user: true } } },
      });
      Utils.checkEntity(booking, 'Бронирование не найдено');
      booking.status = BookingStatus.CANCELED;
      await manager.save(booking);
      const user = await this.userRepository.findOne({
        where: { id: tokenData.id },
        select: { id: true, role: true },
      });
      if (user.role === ROLE_TYPE.BUSINESS) {
        const notificationDto = {
          email: booking.ad.organization.user.email,
          title: '',
          type: NotificationType.NEGATIVE,
          message: `Бронь на объявление "${booking.ad.title}" была отменена`,
        };
        await this.notificationService.createForUser(notificationDto);
      } else if (user.role === ROLE_TYPE.TOURIST) {
        const notificationDto = {
          email: booking.user.email,
          title: '',
          type: NotificationType.NEGATIVE,
          message: `Ваша бронь на объявление "${booking.ad.title}" была отменена`,
        };
        await this.notificationService.createForUser(notificationDto);
      }

      return JSON.stringify(HttpStatus.OK);
    });
  }

  @CatchErrors()
  async bookingConfirm(id: string) {
    return await this.dataSource.transaction(async () => {
      const booking = await this.bookingRepository.findOne({
        where: { id: id },
        relations: { user: true, ad: true },
      });
      Utils.checkEntity(booking, 'Объявление не найдено');
      booking.status = BookingStatus.CONFIRM;
      await this.bookingRepository.save(booking);
      const notificationDto = {
        email: booking.user.email,
        title: '',
        type: NotificationType.POSITIVE,
        message: `Ваша бронь на объявление "${booking.ad.title}" была подтверждена`,
      };
      await this.notificationService.createForUser(notificationDto);
      return JSON.stringify(HttpStatus.OK);
    });
  }

  @CatchErrors()
  async bookingPayed(id: string) {
    return await this.dataSource.transaction(async () => {
      const booking = await this.bookingRepository.findOne({
        where: { id: id },
        relations: { ad: { organization: { user: true } } },
      });
      Utils.checkEntity(booking, 'Объявление не найдено');
      booking.status = BookingStatus.PAYED;
      await this.bookingRepository.save(booking);

      const notificationDto = {
        email: booking.ad.organization.user.email,
        title: '',
        type: NotificationType.POSITIVE,
        message: `Бронь на объявление "${booking.ad.title}" была оплачена`,
      };

      await this.notificationService.createForUser(notificationDto);

      return JSON.stringify(HttpStatus.OK);
    });
  }

  @CatchErrors()
  async bookingDone(id: string) {
    const booking = await this.bookingRepository.findOne({ where: { id: id } });
    Utils.checkEntity(booking, 'Объявление не найдено');
    booking.status = BookingStatus.DONE;
    await this.bookingRepository.save(booking);
    return JSON.stringify(HttpStatus.OK);
  }
}
