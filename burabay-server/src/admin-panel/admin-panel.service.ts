import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { CatchErrors, Utils } from 'src/utilities';
import { IsNull, Not, Repository } from 'typeorm';
import { UsersFilter, UsersFilterStatus } from './types/admin-panel-filters.type';
import stringSimilarity from 'string-similarity-js';
import { AdminPanelAd } from './types/admin-panel-ads.type';
import { AnalyticsService } from './analytics.service';

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
    private readonly analyticsService: AnalyticsService,
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
        bookingCount: ad.bookings.length,
      };
      return result;
    });
    const ga4Data = await ga4DataPromise;
    return {
      tourists,
      orgs,
      totalUsers,
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
        user: { fullName: true },
        ad: {
          images: true,
          title: true,
          reviewCount: true,
          avgRating: true,
          organization: { name: true, imgUrl: true },
        },
        report: {
          text: true,
          date: true,
        },
      },
    });
    return reviews.map((review) => {
      return {
        reviewId: review.id,
        username: review.user.fullName,
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
  async getOrgAndAds(orgId: string) {
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

  /** Логика при нажатии на "Оставить отзыв" на экране Жалоб в Админ Панели. */
  @CatchErrors()
  async checkReview(reviewId: string) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    review.isCheked = true;
    await this.reviewRepository.save(review);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Получение данных с реализацией фильтрации для экрана Пользователи в Админ Панели. */
  @CatchErrors()
  async getUsers(filter?: UsersFilter) {
    let users: User[] = [],
      orgsUsers: User[] = [];
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
      users = await this.userRepository.find({ where: usersWhereOptions });
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
        relations: { organization: true },
      });
      users = await this.userRepository.find({ where: usersWhereOptions });
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
    return { users, orgsUsers };
  }

  /** Подтверждение Организации. */
  @CatchErrors()
  async checkOrg(orgId: string) {
    const org = await this.organizationRepository.findOne({ where: { id: orgId } });
    Utils.checkEntity(org, 'Орагнизация не найдена');
    org.isConfirmed = true;
    org.isConfirmCanceled = false;
    await this.organizationRepository.save(org);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Отклонение подтверждения Орагнизации. */
  @CatchErrors()
  async cancelCheckOrg(orgId: string) {
    const org = await this.organizationRepository.findOne({ where: { id: orgId } });
    Utils.checkEntity(org, 'Орагнизация не найдена');
    org.isConfirmCanceled = true;
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

  /** Логика для блокировки Орагнизации. */
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
