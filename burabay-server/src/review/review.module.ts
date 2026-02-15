import { Module } from '@nestjs/common';
import { EmailModule } from 'src/authentication/email.module';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { User } from 'src/users/entities/user.entity';
import { Review } from './entities/review.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';
import { FirebaseAdminService } from 'src/notification/firebase-admin.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, User, Review, Notification]), NotificationModule],
  controllers: [ReviewController],
  providers: [ReviewService, FirebaseAdminService],
})
export class ReviewModule {}
