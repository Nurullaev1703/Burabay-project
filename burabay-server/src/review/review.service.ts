import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CatchErrors, Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { User } from 'src/users/entities/user.entity';
import { Review } from './entities/review.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private dataSource: DataSource,
  ) {}

  @CatchErrors()
  async create(createReviewDto: CreateReviewDto, tokenData: TokenData) {
    return await this.dataSource.transaction(async (manager) => {
      const { adId, ...oF } = createReviewDto;
      const user = await manager.findOne(User, { where: { id: tokenData.id } });
      Utils.checkEntity(user, 'Пользователь не найден');
      const ad = await manager.findOne(Ad, {
        where: { id: adId },
        relations: { reviews: true },
      });
      Utils.checkEntity(ad, 'Объявление не найдено');
      const newReview = manager.create(Review, {
        user: user,
        ad: ad,
        ...oF,
      });
      const rating = ad.reviews.map((r) => r.stars).reduce((a, b) => a + b, 0) + oF.stars;
      const length = ad.reviews.length + 1;
      ad.avgRating = Math.round((length > 0 ? rating / length : 0) * 10) / 10;
      ad.reviewCount = length;
      await manager.save(ad);
      await manager.save(newReview);
      return JSON.stringify(HttpStatus.CREATED);
    });
  }

  async findAll() {
    try {
      return await this.reviewRepository.find({
        relations: {
          user: true,
          answer: true,
          report: true,
        },
      });
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findAllByAd(adId: string) {
    try {
      const ad = await this.adRepository.findOne({
        where: { id: adId },
        relations: { reviews: { user: true, answer: true, report: true } },
      });
      Utils.checkEntity(ad, 'Объявление не найдено');
      return ad.reviews;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async findOne(id: string) {
    try {
      const review = await this.reviewRepository.findOne({
        where: { id: id },
        relations: { user: true, answer: true, report: true },
      });
      Utils.checkEntity(review, 'Отзыв не найден');
      return review;
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { adId, ...oF } = updateReviewDto;
      const review = await this.reviewRepository.findOne({ where: { id: id } });
      Utils.checkEntity(review, 'Отзыв не найден');
      Object.assign(review, oF);
      await this.reviewRepository.save(review);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  @CatchErrors()
  async remove(id: string) {
    return await this.dataSource.transaction(async (manager) => {
      const review = await manager.findOne(Review, {
        where: { id: id },
        relations: { answer: true, report: true },
      });
      Utils.checkEntity(review, 'Отзыв не найден');
      await manager.remove(review.answer);
      await manager.remove(review.report);
      await manager.remove(review);
      return JSON.stringify(HttpStatus.OK);
    });
  }
}
