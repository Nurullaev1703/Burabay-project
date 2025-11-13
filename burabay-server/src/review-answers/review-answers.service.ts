import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateReviewAnswerDto } from './dto/create-review-answer.dto';
import { UpdateReviewAnswerDto } from './dto/update-review-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/review/entities/review.entity';
import { ReviewAnswer } from './entities/review-answer.entity';
import { DataSource, Repository } from 'typeorm';
import { Organization } from 'src/users/entities/organization.entity';
import { CatchErrors, Utils } from 'src/utilities';
import { NotificationType } from 'src/notification/types/notification.type';
import { NotificationService } from 'src/notification/notification.service';
import { ROLE_TYPE } from 'src/users/types/user-types';
import { User } from 'src/users/entities/user.entity';
import { NotificationsMessages } from 'src/notifications';

@Injectable()
export class ReviewAnswersService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewAnswer)
    private readonly reviewAnswerRepository: Repository<ReviewAnswer>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) { }

  @CatchErrors()
  async create(createReviewAnswerDto: CreateReviewAnswerDto, tokenData: TokenData) {
    return await this.dataSource.transaction(async (manager) => {
      const org = await this.organizationRepository.findOne({
        where: { user: { id: tokenData.id } },
      });
      Utils.checkEntity(org, 'Орагнизация не найдена');
      const review = await this.reviewRepository.findOne({
        where: { id: createReviewAnswerDto.reviewId },
        relations: { user: true, ad: true },
      });
      Utils.checkEntity(review, 'Отзыв не найден');
      const answer = this.reviewAnswerRepository.create({
        review,
        org,
        text: createReviewAnswerDto.text,
        date: new Date(),
      });
      await this.reviewAnswerRepository.save(answer);
      const notificationData = NotificationsMessages.answerReviewForTourist(review.user.language, review.ad.title);
      const notificationDto = {
        email: review.user.email,
        title: notificationData.title,
        type: NotificationType.NEUTRAL,
        message: notificationData.text,
      };
      await this.notificationService.createForUser(notificationDto);
      return JSON.stringify(HttpStatus.CREATED);
    });
  }

  @CatchErrors()
  async update(id: string, updateReviewAnswerDto: UpdateReviewAnswerDto, tokenData: TokenData) {
    const answer = await this.reviewAnswerRepository.findOne({ where: { id: id } });
    Utils.checkEntity(answer, 'Ответ не найден');
    const user = await this.userRepository.findOne({ where: { id: tokenData.id } });
    Utils.checkEntity(user, 'Пользователь не найден');
    if (user.role !== ROLE_TYPE.ADMIN && user.role !== ROLE_TYPE.BUSINESS)
      throw new HttpException('Недостаточно прав для обновления ответа', HttpStatus.FORBIDDEN);
    Object.assign(answer, updateReviewAnswerDto);
    await this.reviewAnswerRepository.save(answer);
    return JSON.stringify(HttpStatus.OK);
  }

  @CatchErrors()
  async remove(id: string, tokenData: TokenData) {
    const answer = await this.reviewAnswerRepository.findOne({ where: { id: id } });
    Utils.checkEntity(answer, 'Ответ не найден');
    const user = await this.userRepository.findOne({ where: { id: tokenData.id } });
    Utils.checkEntity(user, 'Пользователь не найден');
    if (user.role !== ROLE_TYPE.ADMIN && user.role !== ROLE_TYPE.BUSINESS)
      throw new HttpException('Недостаточно прав для удаления ответа', HttpStatus.FORBIDDEN);
    await this.reviewAnswerRepository.remove(answer);
    return JSON.stringify(HttpStatus.OK);
  }
}
