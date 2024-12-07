import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateAdDto {
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

  @IsString()
  @IsNotEmpty()
  organizationId: string;

  // TODO Удалить после 29 декабря.
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  // TODO Раскомментить после 29 декабря.
  // @IsString()
  // @IsNotEmpty()
  // subcategoryId: string;
}
