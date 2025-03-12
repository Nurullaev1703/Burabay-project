import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewAnswerDto } from './dto/create-review-answer.dto';
import { UpdateReviewAnswerDto } from './dto/update-review-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/review/entities/review.entity';
import { ReviewAnswer } from './entities/review-answer.entity';
import { Repository } from 'typeorm';
import { Organization } from 'src/users/entities/organization.entity';
import { CatchErrors, Utils } from 'src/utilities';

@Injectable()
export class ReviewAnswersService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewAnswer)
    private readonly reviewAnswerRepository: Repository<ReviewAnswer>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  @CatchErrors()
  async create(createReviewAnswerDto: CreateReviewAnswerDto, tokenData: TokenData) {
    const org = await this.organizationRepository.findOne({
      where: { user: { id: tokenData.id } },
    });
    Utils.checkEntity(org, 'Орагнизация не найдена');
    const review = await this.reviewRepository.findOne({
      where: { id: createReviewAnswerDto.reviewId },
    });
    Utils.checkEntity(review, 'Отзыв не найден');
    const answer = this.reviewAnswerRepository.create({
      review,
      org,
      text: createReviewAnswerDto.text,
      date: new Date(),
    });
    await this.reviewAnswerRepository.save(answer);
    // XXX Уведомление об ответе на отзыв Туристу
    return JSON.stringify(HttpStatus.CREATED);
  }

  @CatchErrors()
  async update(id: string, updateReviewAnswerDto: UpdateReviewAnswerDto) {
    const answer = await this.reviewAnswerRepository.findOne({ where: { id: id } });
    Utils.checkEntity(answer, 'Ответ не найден');
    Object.assign(answer, updateReviewAnswerDto);
    await this.reviewAnswerRepository.save(answer);
    return JSON.stringify(HttpStatus.OK);
  }

  @CatchErrors()
  async remove(id: string) {
    const answer = await this.reviewAnswerRepository.findOne({ where: { id: id } });
    Utils.checkEntity(answer, 'Ответ не найден');
    await this.reviewAnswerRepository.remove(answer);
    return JSON.stringify(HttpStatus.OK);
  }
}
