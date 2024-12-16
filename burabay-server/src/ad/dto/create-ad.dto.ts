import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsObject,
} from 'class-validator';
import { AdDetailsType } from '../types/ad.details.type';

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

  @IsObject()
  @IsOptional()
  // @Validate(IsAdDetailsType)
  details?: AdDetailsType;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;
}
