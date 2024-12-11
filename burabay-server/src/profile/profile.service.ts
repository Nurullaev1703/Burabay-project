import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    });

    return new Profile(user);
  }

  async updateProfile(tokenData: TokenData, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: tokenData.id,
      }
    });

    if (!user) throw new HttpException('Данный пользователь не найден', HttpStatus.NOT_FOUND);

    await this.userRepository.update(user.id, {
      ...user,
      fullName: updateProfileDto.fullName || user.fullName,
      phoneNumber: updateProfileDto.phoneNumber,
    });
    return JSON.stringify('Пользователь изменен');
  }

  async getUsers() {
    return this.userRepository.find({
      relations: {
      },
    });
  }
}
