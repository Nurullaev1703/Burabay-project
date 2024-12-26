import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
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
  ) {}

  @CatchErrors()
  async getStats() {
    const users = await this.userRepository.count();
    const orgs = await this.organizationRepository.count();
    const ads = await this.adRepository.count();
    const reviews = await this.reviewRepository.count();
    return { users, orgs, ads, reviews };
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
    return await this.adRepository.find();
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
