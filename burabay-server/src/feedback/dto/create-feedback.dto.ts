import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  uncomfortableText: string;

  @IsOptional()
  @IsString()
  adviceText: string;

  @IsNotEmpty()
  @IsNumber()
  stars: number;
}
