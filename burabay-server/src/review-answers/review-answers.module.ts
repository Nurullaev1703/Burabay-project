import { Module } from '@nestjs/common';
import { ReviewAnswersService } from './review-answers.service';
import { ReviewAnswersController } from './review-answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewAnswer } from './entities/review-answer.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { FirebaseAdminService } from 'src/notification/firebase-admin.service';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ReviewAnswer, Review, Organization, Notification, User])],
  controllers: [ReviewAnswersController],
  providers: [ReviewAnswersService,NotificationService, FirebaseAdminService],
})
export class ReviewAnswersModule {}
