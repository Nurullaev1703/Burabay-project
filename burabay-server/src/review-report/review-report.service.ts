import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewReportDto } from './dto/create-review-report.dto';
import { UpdateReviewReportDto } from './dto/update-review-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CatchErrors, Utils } from 'src/utilities';
import { Organization } from 'src/users/entities/organization.entity';
import { Repository } from 'typeorm';
import { Review } from 'src/review/entities/review.entity';
import { ReviewReport } from './entities/review-report.entity';
import { User } from 'src/users/entities/user.entity';

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
  ) {}

  @CatchErrors()
  async create(createReviewReportDto: CreateReviewReportDto, tokenData: TokenData) {
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      relations: { organization: true },
    });
    Utils.checkEntity(user.organization, 'Орагнизация не найдена');
    const review = await this.reviewRepository.findOne({
      where: { id: createReviewReportDto.reviewId },
    });
    Utils.checkEntity(review, 'Отзыв не найден');
    const report = this.reviewReportRepository.create({
      review,
      org: user.organization,
      text: createReviewReportDto.text,
      date: new Date(),
    });
    await this.reviewReportRepository.save(report);
    return JSON.stringify(HttpStatus.CREATED);
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
