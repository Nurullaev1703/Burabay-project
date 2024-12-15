import { HttpStatus, Injectable } from '@nestjs/common';
import CreateScheduleDto from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Utils } from 'src/utilities';
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
  ) {}
  async create(createScheduleDto: CreateScheduleDto) {
    try {
      const { adId, ...oF } = createScheduleDto;
      const ad = await this.adRepository.findOne({ where: { id: adId } });
      Utils.check(ad, 'Объявление не найдено');

      const newSchedule = this.scheduleRepository.create({
        ad: ad,
        ...oF,
      });

      await this.scheduleRepository.save(newSchedule);
      return JSON.stringify(HttpStatus.CREATED);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findByAd(adId: string) {
    try {
      const schedule = await this.scheduleRepository.find({ where: { ad: { id: adId } } });
      Utils.check(schedule, 'График не найден');
      return schedule;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    try {
      const schedule = await this.scheduleRepository.findOne({ where: { id: id } });
      Utils.check(schedule, 'График не найден');
      Object.assign(schedule, updateScheduleDto);
      await this.scheduleRepository.save(schedule);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async remove(id: string) {
    try {
      const schedule = await this.scheduleRepository.findOne({ where: { id: id } });
      Utils.check(schedule, 'График не найден');
      await this.scheduleRepository.remove(schedule);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
}
