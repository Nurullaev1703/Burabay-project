import { Module } from '@nestjs/common';
import { ReviewAnswersService } from './review-answers.service';
import { ReviewAnswersController } from './review-answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewAnswer } from './entities/review-answer.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewAnswer, Review, Organization])],
  controllers: [ReviewAnswersController],
  providers: [ReviewAnswersService],
})
export class ReviewAnswersModule {}
