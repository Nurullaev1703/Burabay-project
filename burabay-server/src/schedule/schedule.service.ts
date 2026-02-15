import { HttpStatus, Inject, Injectable, HttpException } from '@nestjs/common';
import CreateScheduleDto from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Utils } from 'src/utilities';
import { User } from 'src/users/entities/user.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
  ) { }
  async create(createScheduleDto: CreateScheduleDto, tokenData: TokenData) {
    try {
      const currentUser = await this.#checkRole(tokenData.id);
      const { adId, ...oF } = createScheduleDto;
      const ad = await this.adRepository.findOne({ where: { id: adId }, relations: { organization: true } });
      Utils.checkEntity(ad, 'Объявление не найдено');
      if (currentUser.role === ROLE_TYPE.BUSINESS)
        await this.#checkAccess(ad.organization.id, currentUser);
      const newSchedule = this.scheduleRepository.create({ ad: ad, ...oF, });
      await this.scheduleRepository.save(newSchedule);
      return JSON.stringify(HttpStatus.CREATED);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findByAd(adId: string) {
    try {
      const schedule = await this.scheduleRepository.find({ where: { ad: { id: adId } } });
      Utils.checkEntity(schedule, 'График не найден');
      return schedule;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto, tokenData: TokenData) {
    try {
      const currentUser = await this.#checkRole(tokenData.id);
      const schedule = await this.scheduleRepository.findOne({ where: { id: id }, relations: { ad: { organization: true } } });
      Utils.checkEntity(schedule, 'График не найден');
      if (currentUser.role === ROLE_TYPE.BUSINESS)
        await this.#checkAccess(schedule.ad.organization.id, currentUser);
      Object.assign(schedule, updateScheduleDto);
      await this.scheduleRepository.save(schedule);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async remove(id: string, tokenData: TokenData) {
    try {
      const currentUser = await this.#checkRole(tokenData.id);
      const schedule = await this.scheduleRepository.findOne({ where: { id: id }, relations: { ad: { organization: true } } });
      Utils.checkEntity(schedule, 'График не найден');
      if (currentUser.role === ROLE_TYPE.BUSINESS)
        await this.#checkAccess(schedule.ad.organization.id, currentUser);
      await this.scheduleRepository.remove(schedule);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
  async #checkRole(userId: string) {
    const userRepo = this.scheduleRepository.manager.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId }, relations: { organization: true } });
    Utils.checkEntity(user, 'Пользователь не найден');
    if (user.role !== ROLE_TYPE.BUSINESS && user.role !== ROLE_TYPE.ADMIN)
      throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
    return user;
  }

  async #checkAccess(organizationId: string, user: User) {
    if (!user.organization || user.organization.id !== organizationId) {
      throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
    }
  }
}
