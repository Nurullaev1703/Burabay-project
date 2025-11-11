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
      // Очищаем siteUrl от пробелов если он был передан
      const cleanSiteUrl = updateProfileDto.organization.siteUrl 
        ? updateProfileDto.organization.siteUrl.replace(/\s+/g, '')
        : user.organization.siteUrl;
        
      await this.organizationRepository.update(user.organization.id, {
        ...user.organization,
        imgUrl: updateProfileDto.organization.imgUrl || user.organization.imgUrl,
        name: updateProfileDto.organization.name || user.organization.name,
        description: updateProfileDto.organization.description || user.organization.description,
        isConfirmed: updateProfileDto.organization.isConfirmed || user.organization.isConfirmed,
        siteUrl: cleanSiteUrl,
      });
    }
    return this.getProfile({id: user.id});
  }

  async getUsers() {
    const users = await this.userRepository.find({
      relations: {
        organization: true,
      },
    });
    const filteredUsers = users.map((user) => new Profile(user));
    return filteredUsers;
  }
}
