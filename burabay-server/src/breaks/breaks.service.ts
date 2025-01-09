import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBreakDto } from './dto/create-break.dto';
import { UpdateBreakDto } from './dto/update-break.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Break } from './entities/break.entity';
import { CatchErrors, Utils } from 'src/utilities';

@Injectable()
export class BreaksService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Break)
    private readonly breakRepository: Repository<Break>,
  ) {}

  @CatchErrors()
  async create(createBreakDto: CreateBreakDto[]) {
    const newBreaks: Break[] = [];
    for (const createBreak of createBreakDto) {
      const { adId, ...oF } = createBreak;
      const ad = await this.adRepository.findOne({ where: { id: adId } });
      Utils.checkEntity(ad, 'Объявление не найдено');
      const newBreak = this.breakRepository.create({
        ad: ad,
        ...oF,
      });
      newBreaks.push(newBreak);
    }
    await this.breakRepository.save(newBreaks);
    return JSON.stringify(HttpStatus.CREATED);
  }

  async findAllByAd(adId: string) {
    try {
      // const ad = await this.adRepository.findOne({ where: { id: adId } });
      // Utils.checkEntity(ad, 'Объявление не найдено');
      return await this.breakRepository.find({ where: { ad: { id: adId } } });
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  @CatchErrors()
  async update(adId: string, updateBreakDto: UpdateBreakDto[]) {
    const findBreaks = await this.breakRepository.find({ where: { ad: { id: adId } } });
    Utils.checkEntity(findBreaks, 'Перерывы не найден');
    const updateLength = updateBreakDto.length;

    if (updateBreakDto.length === 0) {
      await this.breakRepository.remove(findBreaks);
      return JSON.stringify(HttpStatus.OK);
    }

    if (findBreaks.length < updateBreakDto.length) {
      throw new HttpException(
        'Количество обновлений больше, чем перерывов',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    for (let i = 0; i < updateLength; i++) {
      Object.assign(findBreaks[i], updateBreakDto[i]);
      await this.breakRepository.save(findBreaks[i]);
    }

    return JSON.stringify(HttpStatus.OK);
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
