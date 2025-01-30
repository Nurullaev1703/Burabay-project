import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { CatchErrors } from 'src/utilities';
import { Repository } from 'typeorm';

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
  async getAds() {
    const ads = await this.adRepository.find();
    const result = [];
    for (const ad of ads) {
      const bookingsCount = await this.bookingRespository.count({ where: { ad: { id: ad.id } } });
      result.push({
        adTitle: ad.title,
        adImage: ad.images[0],
        adId: ad.id,
        bookingsCount: bookingsCount,
      });
    }
    return {
      count: result.length,
      ads: result,
    };
  }

  @CatchErrors()
  async getReviews() {
    return await this.reviewRepository.find();
  }

  @CatchErrors()
  async banTourist(userId: string, value: boolean) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.isBanned = value;
    await this.userRepository.save(user);
  }

  @CatchErrors()
  async banOrg(orgId: string, value: boolean) {
    const org = await this.organizationRepository.findOne({ where: { id: orgId } });
    org.isBanned = value;
    await this.organizationRepository.save(org);
  }
}
