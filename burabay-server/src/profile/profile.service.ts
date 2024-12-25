import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './models/profile.model';
import { User } from 'src/users/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Organization } from 'src/users/entities/organization.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async getProfile(tokenData: TokenData) {
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      relations: {
        organization: true,
      },
    });

    return new Profile(user);
  }

  async updateProfile(tokenData: TokenData, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: tokenData.id,
      },
      relations: {
        organization: true,
      },
    });

    if (!user) throw JSON.stringify(HttpStatus.NOT_FOUND);

    await this.userRepository.update(user.id, {
      ...user,
      fullName: updateProfileDto.fullName || user.fullName,
      email: updateProfileDto.email || user.email,
      isEmailConfirmed: updateProfileDto.isEmailConfirmed || user.isEmailConfirmed,
      picture: updateProfileDto.picture || user.picture,
      phoneNumber: updateProfileDto.phoneNumber || user.phoneNumber,
    });
    if (updateProfileDto.organization) {
      await this.organizationRepository.update(user.organization.id, {
        ...user.organization,
        imgUrl: updateProfileDto.organization.imgUrl || user.organization.imgUrl,
        name: updateProfileDto.organization.name || user.organization.name,
        description: updateProfileDto.organization.description || user.organization.description,
        isConfirmed: updateProfileDto.organization.isConfirmed || user.organization.isConfirmed,
        siteUrl: updateProfileDto.organization.siteUrl || user.organization.siteUrl,
      });
    }
    return this.getProfile({id: user.id});
  }

  async getUsers() {
    return this.userRepository.find({
      relations: {},
    });
  }
}
