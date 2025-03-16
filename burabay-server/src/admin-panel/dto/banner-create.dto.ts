import { IsNotEmpty, IsString } from 'class-validator';

export class BannerCreateDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  imagePath: string;

  @IsString()
  @IsNotEmpty()
  deleteDate: string;
}
