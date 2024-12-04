import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './models/profile.model';
import { User } from 'src/users/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Organization } from 'src/users/entities/organization.entity';
import { POSITION_TYPE } from 'src/users/types/user-types';
import { Address } from 'src/users/entities/address.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async getProfile(tokenData: TokenData) {
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      relations: [
        'filial',
        'filial.organization',
        'filial.address',
        'filial.requisities',
        'filial.notifications',
        'filial.authHistories',
        'filial.employees',
        'filial.clientManager',
      ],
    });

    return new Profile(user);
  }

  // TODO добавить обновление данных о менеджере
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
      position: updateProfileDto.position || user.position,
      iin: updateProfileDto.iin || user.position,
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
