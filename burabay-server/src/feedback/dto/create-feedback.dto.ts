import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
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
