import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { User } from 'src/users/entities/user.entity';
import { Review } from './entities/review.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';
import { FirebaseAdminService } from 'src/notification/firebase-admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, User, Review, Notification])],
  controllers: [ReviewController],
  providers: [ReviewService, NotificationService, FirebaseAdminService],
})
export class ReviewModule {}
