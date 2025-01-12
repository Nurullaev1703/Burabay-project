import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  adId: string;

  @IsOptional()
  @IsArray()
  images: string[];

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNumber()
  @IsNotEmpty()
  stars: number;
}
