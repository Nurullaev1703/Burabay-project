import { Module } from '@nestjs/common';
import { ReviewReportService } from './review-report.service';
import { ReviewReportController } from './review-report.controller';
import { ReviewReport } from './entities/review-report.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewReport, Review, Organization, User])],
  controllers: [ReviewReportController],
  providers: [ReviewReportService],
})
export class ReviewReportModule {}
