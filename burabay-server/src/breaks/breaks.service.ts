import { HttpStatus, Inject, Injectable, HttpException } from '@nestjs/common';
import { CreateBreakDto } from './dto/create-break.dto';
import { UpdateBreakDto } from './dto/update-break.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Break } from './entities/break.entity';
import { CatchErrors, Utils } from 'src/utilities';
import { User } from 'src/users/entities/user.entity';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { CACHE_MANAGER } from '@nestjs/cache-manager/dist/cache.constants';

@Injectable()
export class BreaksService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(Break)
    private readonly breakRepository: Repository<Break>,
    // @Inject(CACHE_MANAGER)
    // private cacheManager: Cache,
  ) { }

  @CatchErrors()
  async create(createBreakDto: CreateBreakDto[], tokenData: TokenData) {
    const currentUser = await this.#checkRole(tokenData.id);
    const newBreaks: Break[] = [];
    for (const createBreak of createBreakDto) {
      const { adId, ...oF } = createBreak;
      const ad = await this.adRepository.findOne({ where: { id: adId }, relations: { organization: true } });
      Utils.checkEntity(ad, 'Объявление не найдено');
      if (currentUser.role === ROLE_TYPE.BUSINESS)
        await this.#checkAccess(ad.organization.id, currentUser);

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
  async update(adId: string, updateBreakDto: UpdateBreakDto[], tokenData: TokenData) {
    const currentUser = await this.#checkRole(tokenData.id);
    const ad = await this.adRepository.findOne({ where: { id: adId }, relations: { organization: true } });
    Utils.checkEntity(ad, 'Объявление не найдено');
    if (currentUser.role === ROLE_TYPE.BUSINESS) {
      await this.#checkAccess(ad.organization.id, currentUser);
    }
    const oldBreaks = await this.breakRepository.find({ where: { ad: { id: adId } } });
    await this.breakRepository.remove(oldBreaks);

    const newBreaks: CreateBreakDto[] = updateBreakDto.map((updateDto) => ({
      adId,
      ...updateDto,
    }));

    await this.create(newBreaks, tokenData);
    return JSON.stringify(HttpStatus.OK);
  }

  async remove(id: string, tokenData: TokenData) {
    try {
      const currentUser = await this.#checkRole(tokenData.id);
      const findBreak = await this.breakRepository.findOne({ where: { id: id }, relations: { ad: { organization: true } } });
      Utils.checkEntity(findBreak, 'Перерыв не найден');
      if (currentUser.role === ROLE_TYPE.BUSINESS)
        await this.#checkAccess(findBreak.ad.organization.id, currentUser);

      await this.breakRepository.remove(findBreak);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }
  async #checkRole(userId: string) {
    const userRepo = this.breakRepository.manager.getRepository(User);
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
