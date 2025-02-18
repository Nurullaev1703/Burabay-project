import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { CatchErrors, Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  /* Создать отзыв на приложение от лица пользователя, чей токен передан. */
  async create(createFeedbackDto: CreateFeedbackDto, tokenData: TokenData) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: tokenData.id },
        relations: { feedback: true },
      });
      Utils.checkEntity(user, 'Пользователь не найден');
      const newFeedback = this.feedbackRepository.create(createFeedbackDto);
      await this.feedbackRepository.save(newFeedback);
      user.feedback = newFeedback;
      await this.userRepository.save(user);
      return JSON.stringify(HttpStatus.CREATED);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Получить все отзывы на приложение. */
  async findAll() {
    try {
      return await this.feedbackRepository.find();
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Получить отзыв на приложения пользователя, чей токен передан. */
  async findOneByUser(tokenData: TokenData) {
    try {
      const feedback = await this.feedbackRepository.findOne({
        where: { user: { id: tokenData.id } },
      });
      Utils.checkEntity(feedback, 'Отзыв не найден');
      return feedback;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Обновить отзыв на приложение пользователя, чей токен передан. */
  async update(updateFeedbackDto: UpdateFeedbackDto, tokenData: TokenData) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: tokenData.id },
        relations: { feedback: true },
      });
      Utils.checkEntity(user.feedback, 'Отзыв не найден');
      const feedback = user.feedback;
      Object.assign(feedback, updateFeedbackDto);
      await this.feedbackRepository.save(feedback);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /* Удалить отзыв на приложение пользователя, чей токен передан. */
  @CatchErrors()
  async remove(tokenData: TokenData) {
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      relations: { feedback: true },
    });
    Utils.checkEntity(user.feedback, 'Отзыв не найден');
    const feedback = user.feedback;
    user.feedback = null;
    await this.userRepository.save(user);
    await this.feedbackRepository.remove(feedback);
    return JSON.stringify(HttpStatus.OK);
  }
}
