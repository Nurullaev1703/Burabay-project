import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewAnswerDto {
  @IsString()
  @IsNotEmpty()
  reviewId: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
