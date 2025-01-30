import { Module } from '@nestjs/common';
import { ReviewAnswersService } from './review-answers.service';
import { ReviewAnswersController } from './review-answers.controller';

@Module({
  controllers: [ReviewAnswersController],
  providers: [ReviewAnswersService],
})
export class ReviewAnswersModule {}
