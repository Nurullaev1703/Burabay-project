import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBreakDto } from './dto/create-break.dto';
import { UpdateBreakDto } from './dto/update-break.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Break } from './entities/break.entity';
import { Utils } from 'src/utilities';

@Injectable()
export class BreaksService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Break)
    private readonly breakRepository: Repository<Break>,
  ) {}
  async create(createBreakDto: CreateBreakDto) {
    try {
      const { adId, ...oF } = createBreakDto;
      const ad = await this.adRepository.findOne({ where: { id: adId } });
      Utils.checkEntity(ad, 'Объявление не найдено');
      const newBreak = this.breakRepository.create({
        ad: ad,
        ...oF,
      });
      await this.breakRepository.save(newBreak);
      return JSON.stringify(HttpStatus.CREATED);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findAllByAd(adId: string) {
    try {
      const ad = await this.adRepository.findOne({ where: { id: adId } });
      Utils.checkEntity(ad, 'Объявление не найдено');
      return await this.breakRepository.find({ where: { ad: ad } });
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async update(id: string, updateBreakDto: UpdateBreakDto) {
    try {
      const findBreak = await this.breakRepository.findOne({ where: { id: id } });
      Utils.checkEntity(findBreak, 'Перерыв не найден');
      Object.assign(findBreak, updateBreakDto);
      await this.breakRepository.save(findBreak);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async remove(id: string) {
    try {
      const findBreak = await this.breakRepository.findOne({ where: { id: id } });
      Utils.checkEntity(findBreak, 'Перерыв не найден');
      await this.breakRepository.remove(findBreak);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
}