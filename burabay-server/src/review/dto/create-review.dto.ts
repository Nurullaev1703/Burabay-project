import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  adId: string;

  @IsOptional()
  @IsString()
  images: string[];

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNumber()
  @IsNotEmpty()
  stars: number;
}
