import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { CatchErrors, Utils } from 'src/utilities';
import { IsNull, LessThanOrEqual, Not, Repository } from 'typeorm';
import { UsersFilter, UsersFilterStatus } from './types/admin-panel-filters.type';
import stringSimilarity from 'string-similarity-js';
import { AdminPanelAd } from './types/admin-panel-ads.type';
import { AnalyticsService } from './analytics.service';
import { BookingStatus } from 'src/booking/types/booking.types';
import { ReviewReport } from 'src/review-report/entities/review-report.entity';
import { BannerCreateDto } from './dto/banner-create.dto';
import { Banner } from './entities/baner.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AdminPanelService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewReport)
    private readonly reviewReportRepository: Repository<ReviewReport>,
    private readonly analyticsService: AnalyticsService,
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  /** Получить данные для экрана статистики в Админ Панели. */
  @CatchErrors()
  async getStats() {
    // Получение кол-ва пользователей.
    // const tourists = await this.userRepository.count({ where: { role: ROLE_TYPE.TOURIST } });
    // const orgs = await this.organizationRepository.count();
    const [tourists, orgs] = await Promise.all([
      this.userRepository.count({ where: { role: ROLE_TYPE.TOURIST } }),
      this.organizationRepository.count(),
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
  async getReports() {
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
  async getOrgInfo(orgId: string) {
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
  async getTouristInfo(userId: string) {
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
  async checkReview(reviewId: string) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: { report: true },
    });
    review.isCheked = true;
    await this.reviewReportRepository.remove(review.report);
    await this.reviewRepository.save(review);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Получение данных с реализацией фильтрации для экрана Пользователи в Админ Панели. */
  @CatchErrors()
  async getUsers(filter?: UsersFilter) {
    let users: User[] = [],
      orgsUsers: User[] = [];
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
    if (filter.status === UsersFilterStatus.BAN) {
      usersWhereOptions = { ...usersWhereOptions, isBanned: true };
      orgWhereOptions = { ...orgWhereOptions, isBanned: true };
    }
    if (filter.status === UsersFilterStatus.WAITING) {
      filter.role = ROLE_TYPE.BUSINESS;
      orgWhereOptions = { ...orgWhereOptions, isConfirmed: false };
    }

    // Фильтр по роли.
    if (filter.role === ROLE_TYPE.TOURIST) {
      // Поиск туристов.
      users = await this.userRepository.find({ where: usersWhereOptions, select: selectOptions });
      // Поиск по названию среди туристов.
      if (filter.name) {
        const { searchedUsers } = this._searchUsersOrOrgs(filter.name, users);
        users = searchedUsers;
      }
    } else if (filter.role === ROLE_TYPE.BUSINESS) {
      // Поиск организаций.
      orgsUsers = await this.userRepository.find({
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
      // Поиск по названию среди организацей.
      if (filter.name) {
        const { searchedOrgs } = this._searchUsersOrOrgs(filter.name, undefined, orgsUsers);
        orgsUsers = searchedOrgs;
      }
    } else {
      // Поиск всех пользователей.
      orgsUsers = await this.userRepository.find({
        where: { organization: orgWhereOptions },
        relations: {
          organization: true,
        },
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
      users = await this.userRepository.find({ where: usersWhereOptions, select: selectOptions });
      // Поиск по имени среди всех пользователей.
      if (filter.name) {
        const { searchedUsers, searchedOrgs } = this._searchUsersOrOrgs(
          filter.name,
          users,
          orgsUsers,
        );
        users = searchedUsers;
        orgsUsers = searchedOrgs;
      }
    }
    return [...users, ...orgsUsers];
  }

  /** Подтверждение Организации. */
  @CatchErrors()
  async checkOrg(orgId: string) {
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
  async cancelCheckOrg(orgId: string) {
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
  async banTourist(userId: string, value: boolean) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    Utils.checkEntity(user, 'Пользователь не найден');
    user.isBanned = value;
    await this.userRepository.save(user);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Блокировка Орагнизации. */
  @CatchErrors()
  async banOrg(orgId: string, value: boolean) {
    const org = await this.organizationRepository.findOne({ where: { id: orgId } });
    Utils.checkEntity(org, 'Орагнизация не найдена');
    org.isBanned = value;
    await this.organizationRepository.save(org);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Поиск по названию среди Пользователей или Организациий.  */
  private _searchUsersOrOrgs(
    name: string,
    users?: User[],
    orgsUsers?: User[],
  ): { searchedUsers: User[]; searchedOrgs: User[] } {
    const searchedUsers: User[] = [],
      searchedOrgs: User[] = [];

    if (users) {
      for (const user of users) {
        const simValue = stringSimilarity(user.fullName, name);
        if (simValue > 0.2) {
          searchedUsers.push(user);
        }
      }
    }

    if (orgsUsers) {
      for (const org of orgsUsers) {
        const simValue = stringSimilarity(org.organization.name, name);
        if (simValue > 0.2) {
          searchedOrgs.push(org);
        }
      }
    }

    return { searchedUsers, searchedOrgs };
  }

  @CatchErrors()
  async createBanner(dto: BannerCreateDto) {
    const { text, imagePath, deleteDate } = dto;
    const banner = this.bannerRepository.create({
      text: text,
      imagePath: imagePath,
      deleteDate: Utils.stringDateToDate(deleteDate),
    });
    await this.bannerRepository.save(banner);
    return JSON.stringify(HttpStatus.CREATED);
  }

  @CatchErrors()
  async deleteBanner(id: string) {
    await this.bannerRepository.delete(id);
    return JSON.stringify(HttpStatus.OK);
  }

  @CatchErrors()
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteBannersByDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Обнуляем время, чтобы сравнивать только дату

    const banners = await this.bannerRepository.find({
      where: { deleteDate: LessThanOrEqual(today) },
    });

    if (banners.length > 0) {
      await this.bannerRepository.remove(banners);
      console.log(`Удалено ${banners.length} баннеров`);
    } else {
      console.log('Нет баннеров для удаления');
    }
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
}
