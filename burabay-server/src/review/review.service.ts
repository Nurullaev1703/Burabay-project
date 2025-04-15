import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CatchErrors, Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { User } from 'src/users/entities/user.entity';
import { Review } from './entities/review.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { NotificationType } from 'src/notification/types/notification.type';
import { NotificationService } from 'src/notification/notification.service';
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
    private readonly notificationService: NotificationService,
  ) {}

  @CatchErrors()
  async create(createReviewDto: CreateReviewDto, tokenData: TokenData) {
    return await this.dataSource.transaction(async (manager) => {
      const { adId, ...oF } = createReviewDto;
      const user = await manager.findOne(User, { where: { id: tokenData.id } });
      Utils.checkEntity(user, 'Пользователь не найден');
      const ad = await manager.findOne(Ad, {
        where: { id: adId },
        relations: { reviews: true, organization: { user: true } },
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
      const notificationDto = {
        email: ad.organization.user.email, // Используем email пользователя
        title: '',
        message: `Новый отзыв на объявление "${ad.title}"`,
        type: NotificationType.POSITIVE,
      };

      await this.notificationService.createForUser(notificationDto);

      return JSON.stringify(HttpStatus.CREATED);
    });
  }

  @CatchErrors()
  async findAll(tokenData: TokenData) {
    const ads = await this.adRepository.find({
      where: {
        organization: { user: { id: tokenData.id } },
        reviews: { id: Not(IsNull()) },
      },
      relations: { reviews: true },
    });
    const result = [];
    for (const ad of ads) {
      result.push({
        adId: ad.id,
        adTitle: ad.title,
        adImage: ad.images[0],
        adAvgRating: ad.avgRating,
        newReviews: ad.reviews.filter((r) => r.isNew).length,
      });
    }
    return result;
  }

  @CatchErrors()
  async findAllReviews() {
    return await this.reviewRepository.find({
      relations: { ad: { subcategory: { category: true } }, user: true },
      select: {
        id: true,
        images: true,
        text: true,
        stars: true,
        isCheked: true,
        date: true,
        ad: {
          id: true,
          title: true,
          description: true,
          images: true,
          subcategory: {
            name: true,
            category: { name: true },
          },
        },
        user: {
          id: true,
          fullName: true,
          picture: true,
        },
      },
    });
  }

  @CatchErrors()
  async findAllByAd(adId: string) {
    const ad = await this.adRepository.findOne({
      where: { id: adId },
      relations: { reviews: { user: true, answer: true, report: true } },
    });
    Utils.checkEntity(ad, 'Объявление не найдено');
    // Фильтруем новые отзывы и обновляем их
    const newReviews = ad.reviews.filter((r) => r.isNew);
    if (newReviews.length > 0) {
      await this.reviewRepository.save(newReviews.map((r) => ({ ...r, isNew: false })));
    }
    return {
      adId: ad.id,
      adTitle: ad.title,
      adImage: ad.images[0],
      adAvgRating: ad.avgRating,
      adReviewCount: ad.reviewCount,
      reviews: ad.reviews,
    };
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
        relations: { answer: true, report: true, ad: { reviews: true }, user: true },
      });
      Utils.checkEntity(review, 'Отзыв не найден');

      if (review.answer) await manager.remove(review.answer);
      if (review.report) await manager.remove(review.report);

      // Обновить средний рейтинг Объявления.
      const { ad } = review;
      const totalRating = ad.reviews.reduce((sum, r) => sum + r.stars, 0) - review.stars;
      ad.reviewCount = Math.max(0, ad.reviewCount - 1);
      ad.avgRating = ad.reviewCount > 0 ? Math.round((totalRating / ad.reviewCount) * 10) / 10 : 0;
      await manager.save(ad);

      await manager.remove(review);

      const notificationDto = {
        email: review.user.email,
        title: '',
        type: NotificationType.NEGATIVE,
        message: `Ваш отзыв на объявление "${review.ad.title}" был удалён`,
      };
      await this.notificationService.createForUser(notificationDto);
      return JSON.stringify(HttpStatus.OK);
    });
  }
}
