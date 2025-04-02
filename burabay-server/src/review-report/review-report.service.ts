import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewReportDto } from './dto/create-review-report.dto';
import { UpdateReviewReportDto } from './dto/update-review-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CatchErrors, Utils } from 'src/utilities';
import { Organization } from 'src/users/entities/organization.entity';
import { DataSource, Repository } from 'typeorm';
import { Review } from 'src/review/entities/review.entity';
import { ReviewReport } from './entities/review-report.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationType } from 'src/notification/types/notification.type';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ReviewReportService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewReport)
    private readonly reviewReportRepository: Repository<ReviewReport>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) {}

  @CatchErrors()
  async create(createReviewReportDto: CreateReviewReportDto, tokenData: TokenData) {
    console.log(tokenData);
    return await this.dataSource.transaction(async () => {
      const user = await this.userRepository.findOne({
        where: { id: tokenData.id },
        relations: { organization: true },
      });
      Utils.checkEntity(user.organization, 'Организация не найдена');
      const review = await this.reviewRepository.findOne({
        where: { id: createReviewReportDto.reviewId },
        relations: { user: true, ad: true },
      });
      Utils.checkEntity(review, 'Отзыв не найден');
      const report = this.reviewReportRepository.create({
        review,
        org: user.organization,
        text: createReviewReportDto.text,
        date: new Date(),
      });
      await this.reviewReportRepository.save(report);
      const notificationDto = {
        email: review.user.email,
        title: '',
        type: NotificationType.NEGATIVE,
        message: `На ваш отзыв в объявлении "${review.ad.title}" поступила жалоба`,
      };
      await this.notificationService.createForUser(notificationDto);
      return JSON.stringify(HttpStatus.CREATED);
    });
  }

  @CatchErrors()
  async update(id: string, updateReviewReportDto: UpdateReviewReportDto) {
    const report = await this.reviewReportRepository.findOne({ where: { id: id } });
    Utils.checkEntity(report, 'Ответ не найден');
    Object.assign(report, updateReviewReportDto);
    await this.reviewReportRepository.save(report);
    return JSON.stringify(HttpStatus.OK);
  }

  @CatchErrors()
  async remove(id: string) {
    const report = await this.reviewReportRepository.findOne({ where: { id: id } });
    Utils.checkEntity(report, 'Ответ не найден');
    await this.reviewReportRepository.remove(report);
    return JSON.stringify(HttpStatus.OK);
  }
}
