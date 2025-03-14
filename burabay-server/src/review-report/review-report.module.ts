import { Module } from '@nestjs/common';
import { ReviewReportService } from './review-report.service';
import { ReviewReportController } from './review-report.controller';
import { ReviewReport } from './entities/review-report.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FirebaseAdminService } from 'src/notification/firebase-admin.service';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewReport, Review, Organization, User, Notification])],
  controllers: [ReviewReportController],
  providers: [ReviewReportService, NotificationService, FirebaseAdminService],
})
export class ReviewReportModule {}
