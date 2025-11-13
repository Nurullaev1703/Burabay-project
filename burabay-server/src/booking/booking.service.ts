import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CatchErrors, Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { DataSource, In, LessThanOrEqual, Not, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { BookingFilter, BookingStatus, PaymentType } from './types/booking.types';
import { NotificationType } from 'src/notification/types/notification.type';
import { BookingBanDate } from 'src/booking-ban-date/entities/booking-ban-date.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationsMessages } from 'src/notifications';

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
    private readonly notificationService: NotificationService,
  ) { }

  /* Создание Бронирования. */
  @CatchErrors()
  async create(createBookingDto: CreateBookingDto, tokenData: TokenData) {
    // Начало транзакции для создания.
    return await this.dataSource.transaction(async () => {
      const { adId, dateStart: dateStartDto, dateEnd: dateEndDto, ...oF } = createBookingDto;
      const user = await this.userRepository.findOne({ where: { id: tokenData.id } });
      if (user.role !== ROLE_TYPE.TOURIST)
        throw new HttpException('Создать бронирование может только турист', HttpStatus.FORBIDDEN);
      const ad = await this.adRepository.findOne({
        where: { id: adId },
        relations: { subcategory: { category: true }, organization: { user: true } },
      });
      if (ad.organization.isBanned === true)
        throw new HttpException('Бронирование на это объявление невозможно - организация заблокированна', HttpStatus.FORBIDDEN);
      // Преобразовать строковые даты из DTO в тип js даты.
      let dateStart: Date;
      if (dateStartDto) dateStart = Utils.stringDateToDate(dateStartDto);
      let dateEnd: Date;
      if (dateEndDto) dateEnd = Utils.stringDateToDate(dateEndDto);

      // Создание брони.
      const newBooking = this.bookingRepository.create({
        user: user,
        ad: ad,
        dateStart: dateStart ? dateStart : null,
        dateEnd: dateEnd ? dateEnd : null,
        ...oF,
      });

      // Является ли объявление арендой - для подсчета стоимости.
      const isRent = ad.isFullDay;

      // Вычисление общей стоимости аренды (с учетом детского тарифа).
      if (isRent) {
        const days = (dateEnd.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24);
        newBooking.totalPrice = days * (ad.price + (createBookingDto.isChildRate ? ad.priceForChild : 0));
      }
      // Вычиление общей стоимости услуги (с учетом детского тарифа).
      else newBooking.totalPrice = ad.price + (createBookingDto.isChildRate ? ad.priceForChild : 0);

      // Сохранение.
      await this.bookingRepository.save(newBooking);
      const notificationData = NotificationsMessages.getNewBookingForAdMessage(newBooking.ad.organization.user.language, newBooking.ad.title);
      const notificationDto = {
        email: ad.organization.user.email,
        title: notificationData.title,
        type: NotificationType.POSITIVE,
        message: notificationData.text,
      };
      await this.notificationService.createForUser(notificationDto);
      return JSON.stringify(HttpStatus.CREATED);
    });
  }

  @CatchErrors()
  async findAllByUserId(tokenData: TokenData, filter?: BookingFilter) {
    let whereOptions: Record<string, any> = {
      user: { id: tokenData.id },
    };

    // Фильтр отмененных броней.
    if (filter?.canceled) whereOptions.status = BookingStatus.CANCELED;

    // Фильтр по типу оплаты.
    if (filter?.onSidePayment !== filter?.onlinePayment) {
      if (filter?.onSidePayment) whereOptions.paymentType = PaymentType.CASH;
      if (filter?.onlinePayment) whereOptions.paymentType = PaymentType.ONLINE;
    }

    if (filter.status === 'ACTIVE')
      whereOptions = {
        ...whereOptions,
        status: In([BookingStatus.CONFIRM, BookingStatus.IN_PROCESS, BookingStatus.PAYED]),
      };
    if (filter.status === 'DONE')
      whereOptions = { ...whereOptions, status: In([BookingStatus.DONE, BookingStatus.CANCELED]) };

    const bookings = await this.bookingRepository.find({
      where: whereOptions,
      relations: { user: true, ad: { organization: true, subcategory: { category: true } } },
      order: { createdAt: 'DESC' },
    });

    // Группировка по дате.
    const groups: { header: string; ads: any[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Обнуляем время для корректного сравнения.

    for (const b of bookings) {
      const isRent = b.ad.isFullDay;
      let date: Date;
      let header: string;

      if (isRent) {
        date = b.dateStart;
        header = b.dateStart.toLocaleDateString('ru-RU');
      } else {
        // Проверка на null/undefined для поля date
        if (!b.date) continue; // Пропускаем бронирование без даты
        const [day, month, year] = b.date.split('.').map(Number);
        date = new Date(year, month - 1, day);
        header = b.date;
      }

      // Не меняем header, оставляем дату для URL
      // const diffDays = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      // Дата всегда остаётся в header для использования в URL

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
          createdAt: b.createdAt,
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
    let whereOptions: object = { ad: { organization: { user: { id: tokenData.id } } } };

    // Фильтр по отмененным броням.
    if (filter.canceled) whereOptions = { ...whereOptions, status: BookingStatus.CANCELED };

    // Фильтр по типу оплаты.
    if (filter.onSidePayment !== filter.onlinePayment) {
      if (filter.onSidePayment) whereOptions = { ...whereOptions, paymentType: PaymentType.CASH };
      if (filter.onlinePayment) whereOptions = { ...whereOptions, paymentType: PaymentType.ONLINE };
    }

    if (filter.status === 'ACTIVE')
      whereOptions = {
        ...whereOptions,
        status: In([BookingStatus.CONFIRM, BookingStatus.IN_PROCESS, BookingStatus.PAYED]),
      };

    if (filter.status === 'DONE')
      whereOptions = { ...whereOptions, status: In([BookingStatus.DONE, BookingStatus.CANCELED]) };

    const bookings = await this.bookingRepository.find({
      where: whereOptions,
      relations: { user: true, ad: { organization: true, subcategory: { category: true } } },
      order: { createdAt: 'DESC' },
    });

    const groups = [];

    for (const b of bookings) {
      const isRent = b.ad.isFullDay;

      const today = new Date();
      let date: Date;
      let header: string;

      if (isRent) {
        date = b.dateStart;
        header = b.dateStart.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        });
      } else {
        if (!b.date) continue; // Пропускаем бронирование без даты
        const [day, month, year] = b.date.split('.');
        date = new Date(`${year}-${month}-${day}`);
        header = b.date;
      }

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
          createdAt: b.createdAt,
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
    const isRent = ad.isFullDay;

    // Получение даты для поиска
    let findDate: string;
    // date теперь всегда приходит как DD.MM.YYYY, а не 'today'/'tomorrow'
    const parts = date.split('.');
    if (parts.length === 3 && parts[2].length === 2) {
      parts[2] = `20${parts[2]}`; // Добавляем "20" перед годом
    }
    findDate = parts.join('.');

    let whereOptions: any;
    // Если Турист, то получить только свои брони.
    if (user.role === ROLE_TYPE.TOURIST) whereOptions = { user: { id: tokenData.id } };
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
      if (filter.onSidePayment) whereOptions = { ...whereOptions, paymentType: PaymentType.CASH };
      if (filter.onlinePayment) whereOptions = { ...whereOptions, paymentType: PaymentType.ONLINE };
    }
    if (filter.status === 'ACTIVE')
      whereOptions = {
        ...whereOptions,
        status: In([BookingStatus.CONFIRM, BookingStatus.IN_PROCESS, BookingStatus.PAYED]),
      };
    if (filter.status === 'DONE')
      whereOptions = { ...whereOptions, status: In([BookingStatus.DONE, BookingStatus.CANCELED]) };

    const bookings = await this.bookingRepository.find({ where: whereOptions, relations: { ad: true, user: true } });
    if (bookings.length === 0) return [];

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
  async findOne(id: string, tokenData: TokenData) {
    const booking = await this.bookingRepository.findOne({
      where: { id: id },
      relations: { ad: { organization: { user: true } }, user: true },
    });
    Utils.checkEntity(booking, 'Бронирование не найдено');

    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      select: { id: true, role: true },
    });
    Utils.checkEntity(user, 'Пользователь не найден');

    // Если не владелец брони и не владелец объявления и не админ - ошибка доступа.
    if (booking.user.id !== user.id && booking.ad.organization.user.id !== user.id && user.role !== ROLE_TYPE.ADMIN)
      throw new HttpException('У вас нет прав на просмотр этого бронирования', HttpStatus.FORBIDDEN);
    delete booking.ad.organization.user;
    delete booking.user;
    return booking;
  }

  @CatchErrors()
  async hasActiveBookings(adId: string): Promise<{ hasActive: boolean }> {
    const count = await this.bookingRepository.count({
      where: {
        ad: { id: adId },
        status: In([BookingStatus.CONFIRM, BookingStatus.IN_PROCESS, BookingStatus.PAYED]),
      },
    });
    return { hasActive: count > 0 };
  }

  @CatchErrors()
  async update(id: string, updateBookingDto: UpdateBookingDto, tokenData: TokenData) {
    const booking = await this.bookingRepository.findOne({
      where: { id: id },
      relations: { user: true, ad: { organization: { user: true } } },
    });
    Utils.checkEntity(booking, 'Бронирование не найдено');
    if (booking.ad.organization.isBanned) throw new HttpException('Организация заблокирована', HttpStatus.NOT_FOUND);

    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      select: { id: true, role: true },
    });
    Utils.checkEntity(user, 'Пользователь не найден');

    // Если не владелец брони и не владелец объявления и не админ - ошибка доступа.
    if (booking.user.id !== user.id && booking.ad.organization.user.id !== user.id && user.role !== ROLE_TYPE.ADMIN)
      throw new HttpException('У вас нет прав на изменение этого бронирования', HttpStatus.FORBIDDEN);

    Object.assign(booking, updateBookingDto);
    this.bookingRepository.save(booking);
    delete booking.ad.organization.user;
    delete booking.user;
    return JSON.stringify(HttpStatus.OK);
  }

  @CatchErrors()
  async remove(id: string, tokenData: TokenData) {
    return await this.dataSource.transaction(async (manager) => {
      const booking = await manager.findOne(Booking, {
        where: { id: id },
        relations: { user: true, ad: { organization: { user: true } } },
      });
      Utils.checkEntity(booking, 'Бронирование не найдено');

      const user = await this.userRepository.findOne({
        where: { id: tokenData.id },
        select: { id: true, role: true },
      });
      Utils.checkEntity(user, 'Пользователь не найден');

      // Если не владелец брони и не владелец объявления и не админ - ошибка доступа.
      if (booking.user.id !== user.id && booking.ad.organization.user.id !== user.id && user.role !== ROLE_TYPE.ADMIN)
        throw new HttpException('У вас нет прав на удаление этого бронирования', HttpStatus.FORBIDDEN);

      await manager.remove(booking);
      const notificationData = NotificationsMessages.getDeleteBookingMessage(booking.user.language, booking.ad.title);
      const notificationDto = {
        email: booking.user.email,
        title: notificationData.title,
        type: NotificationType.NEGATIVE,
        message: notificationData.text,
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

      const user = await this.userRepository.findOne({
        where: { id: tokenData.id },
        select: { id: true, role: true },
      });
      Utils.checkEntity(user, 'Пользователь не найден');
      // Если не владелец брони и не владелец объявления и не админ - ошибка доступа.
      if (booking.user.id !== user.id && booking.ad.organization.user.id !== user.id && user.role !== ROLE_TYPE.ADMIN)
        throw new HttpException('У вас нет прав на отмену этого бронирования', HttpStatus.FORBIDDEN);

      booking.status = BookingStatus.CANCELED;
      await manager.save(booking);
      const bbd = await manager.findOne(BookingBanDate, {
        where: {
          ad: { id: booking.ad.id },
          date: booking.date,
          isByBooking: true,
        },
      });
      if (bbd) await manager.remove(bbd);
      // Если отменил Бизнес, то уведомить Туриста.
      if (user.role === ROLE_TYPE.BUSINESS) {
        const notificationData = NotificationsMessages.getCancelBookingMessageForTourist(booking.user.language, booking.ad.title);
        const notificationDto = {
          email: booking.ad.organization.user.email,
          title: notificationData.title,
          type: NotificationType.NEGATIVE,
          message: notificationData.text,
        };
        await this.notificationService.createForUser(notificationDto);
        // Если отменил Турист, то уведомить Бизнес.
      } else if (user.role === ROLE_TYPE.TOURIST) {
        const notificationData = NotificationsMessages.getCancelBookingMessageForOrg(booking.ad.organization.user.language, booking.ad.title);
        const notificationDto = {
          email: booking.user.email,
          title: notificationData.title,
          type: NotificationType.NEGATIVE,
          message: notificationData.text,
        };
        await this.notificationService.createForUser(notificationDto);
      }

      return JSON.stringify(HttpStatus.OK);
    });
  }

  @CatchErrors()
  async bookingConfirm(id: string, tokenData: TokenData) {
    return await this.dataSource.transaction(async () => {
      const booking = await this.bookingRepository.findOne({
        where: { id: id },
        relations: { user: true, ad: { organization: { user: true } } },
      });
      Utils.checkEntity(booking, 'Объявление не найдено');
      if (booking.status == BookingStatus.CANCELED || booking.status == BookingStatus.DONE)
        throw new HttpException('Бронь отменена/завершена и не может быть подтверждена', HttpStatus.BAD_REQUEST);

      const user = await this.userRepository.findOne({
        where: { id: tokenData.id },
        select: { id: true, role: true },
      });
      Utils.checkEntity(user, 'Пользователь не найден');
      // Если не владелец брони и не владелец объявления и не админ - ошибка доступа.
      if (user.id !== booking.user.id && booking.ad.organization.user.id !== user.id && user.role !== ROLE_TYPE.ADMIN)
        throw new HttpException('У вас нет прав на подтверждение этого бронирования', HttpStatus.FORBIDDEN);
      booking.status = BookingStatus.CONFIRM;
      await this.bookingRepository.save(booking);
      const notificationData = NotificationsMessages.acceptBookingForTourist(booking.user.language, booking.ad.title);
      const notificationDto = {
        email: booking.user.email,
        title: notificationData.title,
        type: NotificationType.POSITIVE,
        message: notificationData.text,
      };
      await this.notificationService.createForUser(notificationDto);
      return JSON.stringify(HttpStatus.OK);
    });
  }

  @CatchErrors()
  async bookingPayed(id: string, tokenData: TokenData) {
    return await this.dataSource.transaction(async () => {
      const booking = await this.bookingRepository.findOne({
        where: { id: id },
        relations: { ad: { organization: { user: true } }, user: true },
      });
      Utils.checkEntity(booking, 'Бронирование не найдено');

      const user = await this.userRepository.findOne({
        where: { id: tokenData.id },
        select: { id: true, role: true },
      });
      Utils.checkEntity(user, 'Пользователь не найден');

      // Если не владелец брони и не владелец объявления и не админ - ошибка доступа.
      if (booking.user.id !== user.id && booking.ad.organization.user.id !== user.id && user.role !== ROLE_TYPE.ADMIN)
        throw new HttpException('У вас нет прав на изменение статуса оплаты этого бронирования', HttpStatus.FORBIDDEN);

      booking.status = BookingStatus.PAYED;
      await this.bookingRepository.save(booking);
      const notificationData = NotificationsMessages.payBooking(booking.ad.organization.user.language, booking.ad.title);
      const notificationDto = {
        email: booking.ad.organization.user.email,
        title: notificationData.title,
        type: NotificationType.POSITIVE,
        message: notificationData.text,
      };

      await this.notificationService.createForUser(notificationDto);

      return JSON.stringify(HttpStatus.OK);
    });
  }

  /** Отмена просроченных не принятых заказов */
  @CatchErrors()
  async cancelExpiredUnacceptedBookings() {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Обнуляем время для корректного сравнения только по дате

    // Получаем все бронирования со статусом IN_PROCESS
    const allBookings = await this.bookingRepository.find({
      where: {
        status: BookingStatus.IN_PROCESS,
      },
      relations: { ad: { subcategory: { category: true } }, user: true },
    });

    // Фильтруем бронирования на уровне приложения
    const expiredBookings = allBookings.filter((booking) => {
      const isRent = booking.ad.isFullDay;

      if (isRent) {
        // Для аренды проверяем dateEnd
        if (!booking.dateEnd) return false;
        const endDate = new Date(booking.dateEnd);
        endDate.setHours(0, 0, 0, 0);
        return endDate <= now;
      } else {
        // Для услуг проверяем поле date (строка)
        if (!booking.date) return false;
        const bookingDate = Utils.stringDateToDate(booking.date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate <= now;
      }
    });

    for (const booking of expiredBookings) {
      booking.status = BookingStatus.CANCELED;
      await this.bookingRepository.save(booking);
      const notificationData = NotificationsMessages.expiredBooking(booking.user.language, booking.ad.title)
      const notificationDto = {
        email: booking.user.email,
        title: notificationData.title,
        type: NotificationType.NEGATIVE,
        message: notificationData.text,
      };
      await this.notificationService.createForUser(notificationDto);
    }
  }

  /** Завершение просроченных принятых заказов */
  @CatchErrors()
  async doneExpiredAcceptedBookings() {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Обнуляем время для корректного сравнения только по дате

    // Получаем все бронирования со статусами PAYED и CONFIRM
    const allBookings = await this.bookingRepository.find({
      where: {
        status: In([BookingStatus.PAYED, BookingStatus.CONFIRM]),
      },
      relations: { ad: { subcategory: { category: true } } },
    });

    // Фильтруем бронирования на уровне приложения
    const expiredBookings = allBookings.filter((booking) => {
      const isRent = booking.ad.isFullDay;

      if (isRent) {
        // Для аренды проверяем dateEnd
        if (!booking.dateEnd) return false;
        const endDate = new Date(booking.dateEnd);
        endDate.setHours(0, 0, 0, 0);
        return endDate <= now;
      } else {
        // Для услуг проверяем поле date (строка)
        if (!booking.date) return false;
        const bookingDate = Utils.stringDateToDate(booking.date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate <= now;
      }
    });

    for (const booking of expiredBookings) {
      booking.status = BookingStatus.DONE;
      await this.bookingRepository.save(booking);
    }
  }

  @CatchErrors()
  async bookingDone(id: string, tokenData: TokenData) {
    const booking = await this.bookingRepository.findOne({
      where: { id: id },
      relations: { ad: { organization: { user: true } }, user: true },
    });
    Utils.checkEntity(booking, 'Бронирование не найдено');

    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      select: { id: true, role: true },
    });
    Utils.checkEntity(user, 'Пользователь не найден');

    // Если не владелец брони и не владелец объявления и не админ - ошибка доступа.
    if (booking.user.id !== user.id && booking.ad.organization.user.id !== user.id && user.role !== ROLE_TYPE.ADMIN)
      throw new HttpException('У вас нет прав на завершение этого бронирования', HttpStatus.FORBIDDEN);

    booking.status = BookingStatus.DONE;
    await this.bookingRepository.save(booking);
    return JSON.stringify(HttpStatus.OK);
  }
}
