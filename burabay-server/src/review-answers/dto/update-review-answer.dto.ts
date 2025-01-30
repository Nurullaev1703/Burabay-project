import { PartialType } from '@nestjs/swagger';
import { CreateReviewAnswerDto } from './create-review-answer.dto';

export class UpdateReviewAnswerDto extends PartialType(CreateReviewAnswerDto) {}
