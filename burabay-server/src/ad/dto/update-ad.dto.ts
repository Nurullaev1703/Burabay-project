import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class UpdateAdDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  // TODO Удалить после 29 декабря.
  @IsString()
  @IsNotEmpty()
  subcategoryId: string;

  // TODO Раскомментить после 29 декабря.
  // @IsString()
  // @IsNotEmpty()
  // subcategoryId: string;
}
