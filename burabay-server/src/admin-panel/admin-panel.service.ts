import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { CatchErrors, Utils } from 'src/utilities';
import { IsNull, Not, Repository } from 'typeorm';
import { UsersFilter, UsersFilterStatus } from './types/admin-panel-filters.type';
import stringSimilarity from 'string-similarity-js';

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
    @InjectRepository(Booking)
    private readonly bookingRespository: Repository<Booking>,
  ) {}

  @CatchErrors()
  async getStats() {
    const tourists = await this.userRepository.count({ where: { role: ROLE_TYPE.TOURIST } });
    const orgs = await this.organizationRepository.count();
    return { tourists, orgs };
  }

  @CatchErrors()
  async getTourists() {
    return await this.userRepository.find({ where: { role: ROLE_TYPE.TOURIST } });
  }

  @CatchErrors()
  async getOrgs() {
    return await this.organizationRepository.find({
      relations: {
        address: true,
        user: true,
      },
    });
  }

  @CatchErrors()
  async getReports() {
    const reviews = await this.reviewRepository.find({
      where: { report: { id: Not(IsNull()) }, isCheked: false },
      relations: { report: true, ad: { organization: true }, user: true },
    });
    const result = [];
    for (const review of reviews) {
      result.push({
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
        orgName: review.ad.organization.name,
        orgImage: review.ad.organization.imgUrl,
        reportText: review.report.text,
      });
    }
    return result;
  }

  @CatchErrors()
  async checkReview(reviewId: string) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    review.isCheked = true;
    await this.reviewRepository.save(review);
    return JSON.stringify(HttpStatus.OK);
  }

  @CatchErrors()
  async getUsers(filter?: UsersFilter) {
    let users: User[], orgs: Organization[];
    let usersWhereOptions: any = { role: ROLE_TYPE.TOURIST };
    let orgWhereOptions: any = { user: { role: ROLE_TYPE.BUSINESS } };
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
      if (filter.name) {
        const { searchedUsers } = this._search(filter.name, users);
        users = searchedUsers;
      }
    } else if (filter.role === ROLE_TYPE.BUSINESS) {
      // Поиск организаций.
      orgs = await this.organizationRepository.find({
        where: orgWhereOptions,
      });
      // Поиск по названию среди организацей.
      if (filter.name) {
        const { searchedOrgs } = this._search(filter.name, undefined, orgs);
        orgs = searchedOrgs;
      }
    } else {
      // Поиск всех пользователей.
      orgs = await this.organizationRepository.find({
        where: orgWhereOptions,
      });
      users = await this.userRepository.find({ where: usersWhereOptions });
      // Поиск по имени среди всех пользователей.
      if (filter.name) {
        const { searchedUsers, searchedOrgs } = this._search(filter.name, users, orgs);
        users = searchedUsers;
        orgs = searchedOrgs;
      }
    }
    return { users, orgs };
  }

  @CatchErrors()
  async checkOrg(orgId: string) {
    const org = await this.organizationRepository.findOne({ where: { id: orgId } });
    Utils.checkEntity(org, 'Орагнизация не найдена');
    org.isConfirmed = true;
    await this.organizationRepository.save(org);
    return JSON.stringify(HttpStatus.OK);
  }

  @CatchErrors()
  async banTourist(userId: string, value: boolean) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    Utils.checkEntity(user, 'Пользователь не найден');
    user.isBanned = value;
    await this.userRepository.save(user);
    return JSON.stringify(HttpStatus.OK);
  }

  @CatchErrors()
  async banOrg(orgId: string, value: boolean) {
    const org = await this.organizationRepository.findOne({ where: { id: orgId } });
    Utils.checkEntity(org, 'Орагнизация не найдена');
    org.isBanned = value;
    await this.organizationRepository.save(org);
    return JSON.stringify(HttpStatus.OK);
  }

  private _search(
    name: string,
    users?: User[],
    orgs?: Organization[],
  ): { searchedUsers: User[]; searchedOrgs: Organization[] } {
    const searchedUsers: User[] = [],
      searchedOrgs: Organization[] = [];

    if (users) {
      for (const user of users) {
        const simValue = stringSimilarity(user.fullName, name);
        if (simValue > 0.2) {
          searchedUsers.push(user);
        }
      }
    }

    if (orgs) {
      for (const org of orgs) {
        const simValue = stringSimilarity(org.name, name);
        if (simValue > 0.2) {
          searchedOrgs.push(org);
        }
      }
    }

    return { searchedUsers, searchedOrgs };
  }
}
