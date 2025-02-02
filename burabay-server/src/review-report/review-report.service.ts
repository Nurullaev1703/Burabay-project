import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewReportDto } from './dto/create-review-report.dto';
import { UpdateReviewReportDto } from './dto/update-review-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CatchErrors, Utils } from 'src/utilities';
import { Organization } from 'src/users/entities/organization.entity';
import { Repository } from 'typeorm';
import { Review } from 'src/review/entities/review.entity';
import { ReviewReport } from './entities/review-report.entity';

@Injectable()
export class ReviewReportService {constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewReport)
    private readonly reviewReportRepository: Repository<ReviewReport>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  @CatchErrors()
  async create(createReviewReportDto: CreateReviewReportDto, tokenData: TokenData) {
    const org = await this.organizationRepository.findOne({
      where: { user: { id: tokenData.id } },
    });
    Utils.checkEntity(org, 'Орагнизация не найдена');
    const review = await this.reviewRepository.findOne({
      where: { id: createReviewReportDto.reviewId },
    });
    Utils.checkEntity(review, 'Отзыв не найден');
    const report = this.reviewReportRepository.create({
      review,
      org,
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
