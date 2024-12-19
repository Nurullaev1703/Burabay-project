import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Utils } from 'src/utilities';
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

  async create(createFeedbackDto: CreateFeedbackDto) {
    try {
      const { userId, ...oF } = createFeedbackDto;
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { feedback: true },
      });
      Utils.checkEntity(user, 'Пользователь не найден');
      const newFeedback = this.feedbackRepository.create({
        user: user,
        ...oF,
      });
      await this.feedbackRepository.save(newFeedback);
      return JSON.stringify(HttpStatus.CREATED);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findAll() {
    try {
      return await this.feedbackRepository.find();
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findOneByUser(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { feedback: true },
      });
      return user.feedback;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, ...oF } = updateFeedbackDto;
      const feedback = await this.feedbackRepository.findOne({
        where: { id: id },
      });
      Utils.checkEntity(feedback, 'Отзыв не найден');
      Object.assign(feedback, oF);
      await this.feedbackRepository.save(feedback);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} feedback`;
  }
}
