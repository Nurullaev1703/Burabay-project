import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsObject,
  Validate,
} from 'class-validator';
import { AdDetailsType } from '../types/ad.details.type';
import { IsAdDetailsType } from '../validators/ad-details.validator.';

export class CreateAdDto {
  @IsString()
  @IsNotEmpty()
  subcategoryId: string;

  @IsString()
  @IsNotEmpty()
  organizationId: string;

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
  @IsOptional()
  youtubeLink?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsObject()
  @IsOptional()
  @Validate(IsAdDetailsType)
  details?: AdDetailsType;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  // TODO Удалить после 29 декабря.
  // @IsString()
  // @IsNotEmpty()
  // categoryId: string;
}
