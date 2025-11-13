import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { CatchErrors, Utils } from 'src/utilities';
import { DataSource, IsNull, LessThanOrEqual, Not, Repository } from 'typeorm';
import { UsersFilter, UsersFilterStatus } from './types/admin-panel-filters.type';
import stringSimilarity from 'string-similarity-js';
import { AdminPanelAd } from './types/admin-panel-ads.type';
import { AnalyticsService } from './analytics.service';
import { BookingStatus } from 'src/booking/types/booking.types';
import { ReviewReport } from 'src/review-report/entities/review-report.entity';
import { BannerCreateDto } from './dto/banner-create.dto';
import { Banner } from './entities/baner.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/types/notification.type';
import { Booking } from 'src/booking/entities/booking.entity';

@Injectable()
export class AdminPanelService {
  private readonly logger = new Logger(AdminPanelService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(ReviewReport)
    private readonly reviewReportRepository: Repository<ReviewReport>,
    private readonly analyticsService: AnalyticsService,
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) { }

  /** Получить данные для экрана статистики в Админ Панели. */
  @CatchErrors()
  async getStats(adminId: string) {
    await this.#checkAdminRole(adminId);
    // Получение кол-ва пользователей.
    const [tourists, orgs] = await Promise.all([
      this.userRepository.count({ where: { role: ROLE_TYPE.TOURIST } }),
      this.userRepository.count({ where: { role: ROLE_TYPE.BUSINESS } }),
    ]);
    const totalUsers = tourists + orgs;
    const ga4DataPromise = this.analyticsService.getStatistic();
    // Получение объявлений и кол-во броней к ним.
    const ads = await this.adRepository.find({
      relations: { bookings: true },
      select: {
        id: true,
        title: true,
        images: true,
        reviewCount: true,
        avgRating: true,
      },
    });
    const adsData = ads.map((ad) => {
      const result: AdminPanelAd = {
        id: ad.id,
        title: ad.title,
        reviewCount: ad.reviewCount,
        avgRating: ad.avgRating,
        image: ad.images[0],
        bookingCount: ad.bookings.filter((b) => b.status === BookingStatus.DONE).length,
      };
      return result;
    });
    const ga4Data = await ga4DataPromise;
    return {
      tourists,
      orgs,
      totalUsers,
      adsCount: ads.length,
      ads: this._quickSortAdminPanelAds(adsData),
      ...ga4Data,
    };
  }

  /** Получить данные для экрана жалоб в Админ Панели. */
  @CatchErrors()
  async getReports(adminId: string) {
    await this.#checkAdminRole(adminId);
    const reviews = await this.reviewRepository.find({
      where: { report: { id: Not(IsNull()) }, isCheked: false },
      relations: { report: true, ad: { organization: true }, user: true },
      select: {
        id: true,
        text: true,
        stars: true,
        images: true,
        date: true,
        user: { id: true, fullName: true },
        ad: {
          id: true,
          images: true,
          title: true,
          reviewCount: true,
          avgRating: true,
          organization: { name: true, imgUrl: true, id: true },
        },
        report: {
          text: true,
          date: true,
        },
      },
    });
    return reviews.map((review) => {
      return {
        adId: review.ad.id,
        reviewId: review.id,
        username: review.user.fullName,
        userId: review.user.id,
        reviewDate: review.date,
        reviewStars: review.stars,
        reviewText: review.text,
        reviewImages: review.images,
        adImage: review.ad.images[0],
        adName: review.ad.title,
        adReviewCount: review.ad.reviewCount,
        adRating: review.ad.avgRating,
        orgId: review.ad.organization.id,
        orgName: review.ad.organization.name,
        orgImage: review.ad.organization.imgUrl,
        reportText: review.report.text,
        reportData: review.report.date,
      };
    });
  }

  /** Полные данные об Организации и ее Объявления для раскрытии карточки в Админ Панели. */
  @CatchErrors()
  async getOrgInfo(orgId: string, adminId: string) {
    await this.#checkAdminRole(adminId);
    const org = await this.organizationRepository.findOne({
      where: { id: orgId },
      relations: { ads: { address: true, subcategory: { category: true } }, user: true },
      select: {
        id: true,
        name: true,
        description: true,
        imgUrl: true,
        siteUrl: true,
        user: {
          email: true,
          phoneNumber: true,
        },
        ads: {
          id: true,
          images: true,
          title: true,
          price: true,
          address: { address: true },
          subcategory: { id: true, category: { imgPath: true } },
          avgRating: true,
          reviewCount: true,
        },
      },
    });
    return org;
  }

  /** Полные данные об Пользователе для раскрытии карточки в Админ Панели. */
  @CatchErrors()
  async getTouristInfo(userId: string, adminId: string) {
    await this.#checkAdminRole(adminId);
    return await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        picture: true,
      },
    });
  }

  /** Логика при нажатии на "Оставить отзыв" на экране Жалоб в Админ Панели. */
  @CatchErrors()
  async checkReview(reviewId: string, adminId: string) {
    await this.#checkAdminRole(adminId);
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: { report: true },
    });

    // Проверяем наличие отзыва
    Utils.checkEntity(review, 'Отзыв не найден');

    // Помечаем отзыв как проверенный
    review.isCheked = true;

    // Удаляем жалобу на отзыв, если она существует
    if (review.report) {
      await this.reviewReportRepository.delete(review.report.id);
    }

    await this.reviewRepository.save(review);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Получение данных с реализацией фильтрации для экрана Пользователи в Админ Панели. */
  @CatchErrors()
  async getUsers(adminId: string, filter?: UsersFilter) {
    await this.#checkAdminRole(adminId);
    // Значения по умолчанию и преобразование в числа
    const page = filter.page ? Number(filter.page) : 1;
    const take = filter.take ? Number(filter.take) : 10;
    const skip = (page - 1) * take;

    let users: User[] = [],
      orgsUsers: User[] = [];
    let totalCount = 0;

    const selectOptions = {
      id: true,
      fullName: true,
      phoneNumber: true,
      role: true,
      picture: true,
      email: true,
      isEmailConfirmed: true,
      isBanned: true,
      pushToken: true,
    };

    let usersWhereOptions: any = { role: ROLE_TYPE.TOURIST },
      orgWhereOptions: any = { user: { role: ROLE_TYPE.BUSINESS } };

    // Фильтр по статусу.
    // Заблокированные аккаунты.
    if (filter.status === UsersFilterStatus.BAN) {
      usersWhereOptions = { ...usersWhereOptions, isBanned: true };
      orgWhereOptions = { ...orgWhereOptions, isBanned: true };
    }
    // Организации ожидающие подтверждения.
    if (filter.status === UsersFilterStatus.WAITING) {
      filter.role = ROLE_TYPE.BUSINESS;
      orgWhereOptions = { ...orgWhereOptions, isConfirmed: false };
    }

    // Фильтр по роли.
    // Поиск туристов.
    if (filter.role === ROLE_TYPE.TOURIST) {
      // Получаем пользователей с учетом поиска
      const allUsers = await this.userRepository.find({
        where: usersWhereOptions,
        select: selectOptions,
      });

      // Применяем поиск по имени/email/телефону если есть
      if (filter.searchQuery) {
        users = this.#filterUsersBySearch(allUsers, filter.searchQuery);
      } else {
        users = allUsers;
      }

      totalCount = users.length;
      // Применяем пагинацию к отфильтрованным результатам
      users = users.slice(skip, skip + take);
    }
    // Поиск организаций.
    else if (filter.role === ROLE_TYPE.BUSINESS) {
      // Получаем все организации
      const allOrgs = await this.userRepository.find({
        where: { organization: orgWhereOptions },
        relations: { organization: true },
        select: {
          ...selectOptions,
          organization: {
            id: true,
            imgUrl: true,
            name: true,
            bin: true,
            regCouponPath: true,
            ibanDocPath: true,
            orgRulePath: true,
            rating: true,
            reviewCount: true,
            isConfirmed: true,
            isConfirmCanceled: true,
            description: true,
            siteUrl: true,
            isBanned: true,
          },
        },
      });

      // Применяем поиск по имени/email/телефону если есть
      if (filter.searchQuery) {
        orgsUsers = this.#filterOrgsBySearch(allOrgs, filter.searchQuery);
      } else {
        orgsUsers = allOrgs;
      }

      totalCount = orgsUsers.length;
      // Применяем пагинацию к отфильтрованным результатам
      orgsUsers = orgsUsers.slice(skip, skip + take);
    }
    // Поиск всех пользователей.
    else {
      // Получаем всех пользователей и организации
      const [allOrgs, allUsers] = await Promise.all([
        this.userRepository.find({
          where: { organization: orgWhereOptions },
          relations: { organization: true },
          select: {
            ...selectOptions,
            organization: {
              id: true,
              imgUrl: true,
              name: true,
              bin: true,
              regCouponPath: true,
              ibanDocPath: true,
              orgRulePath: true,
              rating: true,
              reviewCount: true,
              isConfirmed: true,
              isConfirmCanceled: true,
              description: true,
              siteUrl: true,
              isBanned: true,
            },
          },
        }),
        this.userRepository.find({
          where: usersWhereOptions,
          select: selectOptions,
        }),
      ]);

      // Применяем поиск по имени/email/телефону если есть
      if (filter.searchQuery) {
        users = this.#filterUsersBySearch(allUsers, filter.searchQuery);
        orgsUsers = this.#filterOrgsBySearch(allOrgs, filter.searchQuery);
      } else {
        users = allUsers;
        orgsUsers = allOrgs;
      }

      // Объединяем результаты и применяем пагинацию
      const combined = [...orgsUsers, ...users];
      totalCount = combined.length;
      const paginatedCombined = combined.slice(skip, skip + take);

      return {
        data: paginatedCombined,
        total: totalCount,
        page,
        take,
        totalPages: Math.ceil(totalCount / take),
      };
    }

    return {
      data: [...orgsUsers, ...users],
      total: totalCount,
      page,
      take,
      totalPages: Math.ceil(totalCount / take),
    };
  }

  /** Подтверждение Организации. */
  @CatchErrors()
  async checkOrg(orgId: string, adminId: string) {
    await this.#checkAdminRole(adminId);
    const org = await this.organizationRepository.findOne({ where: { id: orgId } });
    Utils.checkEntity(org, 'Орагнизация не найдена');
    org.isConfirmed = true;
    org.isConfirmCanceled = false;
    org.isConfirmWating = false;
    await this.organizationRepository.save(org);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Отклонение подтверждения Орагнизации. */
  @CatchErrors()
  async cancelCheckOrg(orgId: string, adminId: string) {
    await this.#checkAdminRole(adminId);
    const org = await this.organizationRepository.findOne({ where: { id: orgId } });
    Utils.checkEntity(org, 'Орагнизация не найдена');
    org.isConfirmCanceled = true;
    org.isConfirmWating = false;
    org.isConfirmed = false;
    await this.organizationRepository.save(org);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Блокировка Пользователя. */
  @CatchErrors()
  async banTourist(userId: string, value: boolean, adminId: string) {
    await this.#checkAdminRole(adminId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    Utils.checkEntity(user, 'Пользователь не найден');
    user.isBanned = value;
    await this.notificationService.createForUser({
      email: user.email,
      title: `Ваш аккаунт был ${value ? 'заблокирован' : 'разблокирован'}`,
      message: `Администратор ${value ? 'заблокировал' : 'разблокировал'} ваш аккаунт.`,
      type: NotificationType.POSITIVE,
    })
    await this.userRepository.save(user);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Блокировка Орагнизации. */
  @CatchErrors()
  async banOrg(orgId: string, value: boolean, adminId: string) {
    await this.#checkAdminRole(adminId);
    const org = await this.organizationRepository.findOne({ where: { id: orgId }, relations: { ads: { bookings: { user: true } } } });
    Utils.checkEntity(org, 'Орагнизация не найдена');
    org.isBanned = value;
    for (const b of org.ads.flatMap((ad) => ad.bookings)) {
      b.status = BookingStatus.CANCELED;
      await this.bookingRepository.save(b);
      await this.notificationService.createForUser({
        email: b.user.email,
        title: `Ваша бронь на объявление ${b.ad.title} отменена`,
        message: `Организация создавшая объявление была заблокирована администратором. Ваша бронь отменена.`,
        type: NotificationType.POSITIVE,
      });
    }
    await this.organizationRepository.save(org);
    return JSON.stringify(HttpStatus.OK);
  }

  async deleteAd(adId: string, adminId: string) {
    await this.#checkAdminRole(adminId);
    return await this.dataSource.transaction(async (manager) => {
      const ad = await manager.findOne(Ad, {
        where: { id: adId },
        relations: {
          reviews: { report: true, answer: true },
          schedule: true,
          bookingBanDate: true,
          breaks: true,
          bookings: true,
          organization: { user: true },
        },
      });
      Utils.checkEntity(ad, 'Объявление не найдено');

      // Уведомления по бронированиям
      for (const b of ad.bookings) {
        await this.notificationService.createForUser({
          title: `Ваша бронь на объявление ${b.ad.title} удалена`,
          message: `Администратор удалил объявление, на которое вы сделали бронь. Ваша бронь удалена.`,
          email: b.user.email,
          type: NotificationType.POSITIVE
        });
      }

      // Удаление связанных сущностей
      if (ad.schedule) await manager.remove(ad.schedule);
      if (ad.bookingBanDate?.length) await manager.remove(ad.bookingBanDate);
      if (ad.breaks?.length) await manager.remove(ad.breaks);
      if (ad.bookings) await manager.remove(ad.bookings);

      if (ad.reviews?.length) {
        await Promise.all(
          ad.reviews.map(async (review) => {
            if (review.answer) await manager.remove(review.answer);
            if (review.report) await manager.remove(review.report);
          })
        );
        await manager.remove(ad.reviews);
      }

      // Удаление самого объявления
      await manager.remove(ad);
      return JSON.stringify(HttpStatus.OK);
    });
  }

  @CatchErrors()
  async createBanner(dto: BannerCreateDto, adminId: string) {
    await this.#checkAdminRole(adminId);
    const { title, text, imagePath, deleteDate } = dto;
    const banner = this.bannerRepository.create({
      title: title,
      text: text,
      imagePath: imagePath,
      deleteDate: Utils.stringDateToDate(deleteDate),
    });
    await this.bannerRepository.save(banner);
    return JSON.stringify(HttpStatus.CREATED);
  }

  @CatchErrors()
  async deleteBanner(id: string, adminId: string) {
    await this.#checkAdminRole(adminId);
    await this.bannerRepository.delete(id);
    return JSON.stringify(HttpStatus.OK);
  }

  async deleteExpiredBanners() {
    this.logger.log('Запуск задачи по удалению устаревших баннеров...');

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Обнуляем время, чтобы сравнивать только дату

    this.logger.log(`Сегодняшняя дата: ${today.toISOString()}`);

    const banners = await this.bannerRepository.find({
      where: { deleteDate: LessThanOrEqual(today) },
    });

    this.logger.log(`Найдено баннеров для удаления: ${banners.length}`);

    if (banners.length > 0) {
      await this.bannerRepository.remove(banners);
      this.logger.log(`Удалено баннеров: ${banners.length}`);
    } else this.logger.log('Нет устаревших баннеров для удаления');
  }

  /** Быстрая сортировка Объявлений по количеству бронирований. */
  _quickSortAdminPanelAds = (ads: AdminPanelAd[]) => {
    if (ads.length < 2) return ads;

    const pivot = ads[0];
    const left = [];
    const right = [];

    for (let i = 1; i < ads.length; i++) {
      if (ads[i].bookingCount > pivot.bookingCount) {
        left.push(ads[i]); // Большее значение теперь идёт в левый массив
      } else {
        right.push(ads[i]);
      }
    }

    return this._quickSortAdminPanelAds(left).concat(pivot, this._quickSortAdminPanelAds(right));
  };

  /** Поиск туристов по имени/email/телефону */
  #filterUsersBySearch(users: User[], searchQuery: string): User[] {
    const normalizedQuery = `%${searchQuery.toLowerCase()}%`;

    return users.filter((user) => {
      const fullName = user.fullName?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const phone = user.phoneNumber?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();

      return fullName.includes(query) || email.includes(query) || phone.includes(query);
    });
  }

  /** Поиск организаций по названию/email/телефону */
  #filterOrgsBySearch(orgsUsers: User[], searchQuery: string): User[] {
    const query = searchQuery.toLowerCase();

    return orgsUsers.filter((org) => {
      const orgName = org.organization?.name?.toLowerCase() || '';
      const email = org.email?.toLowerCase() || '';
      const phone = org.phoneNumber?.toLowerCase() || '';

      return orgName.includes(query) || email.includes(query) || phone.includes(query);
    });
  }

  /** Поиск по названию/email/телефону среди Пользователей или Организациий. СТАРЫЙ МЕТОД */
  #searchUsersOrOrgs(
    searchQuery: string,
    users?: User[],
    orgsUsers?: User[],
  ): { searchedUsers: User[]; searchedOrgs: User[] } {
    const searchedUsers: User[] = [],
      searchedOrgs: User[] = [];

    const normalizedQuery = searchQuery.toLowerCase().trim();

    if (users) {
      for (const user of users) {
        // Поиск по имени, email и номеру телефона
        const nameMatch = stringSimilarity(user.fullName.toLowerCase(), normalizedQuery);
        const emailMatch = user.email?.toLowerCase().includes(normalizedQuery);
        const phoneMatch = user.phoneNumber?.toLowerCase().includes(normalizedQuery);

        if (nameMatch > 0.2 || emailMatch || phoneMatch) {
          searchedUsers.push(user);
        }
      }
    }

    if (orgsUsers) {
      for (const org of orgsUsers) {
        // Поиск по названию организации, email и номеру телефона
        const orgNameMatch = stringSimilarity(org.organization.name.toLowerCase(), normalizedQuery);
        const emailMatch = org.email?.toLowerCase().includes(normalizedQuery);
        const phoneMatch = org.phoneNumber?.toLowerCase().includes(normalizedQuery);

        if (orgNameMatch > 0.2 || emailMatch || phoneMatch) {
          searchedOrgs.push(org);
        }
      }
    }

    return { searchedUsers, searchedOrgs };
  }

  /** Проверка роли Администратора. */
  async #checkAdminRole(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId }, select: { role: true } });
    if (!user || user.role !== ROLE_TYPE.ADMIN) throw new HttpException('Доступ запрещен', HttpStatus.FORBIDDEN);
  }
}
