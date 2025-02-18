import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsOptional()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsNumber()
  stars: number;
}
