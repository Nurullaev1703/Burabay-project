import {
  IsString,
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsBoolean,
} from 'class-validator';
import { AdDetailsType } from '../types/ad.details.type';

export class UpdateAdDto {
  @IsString()
  @IsOptional()
  subcategoryId: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsArray()
  @IsOptional()
  images: string[];

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @IsObject()
  @IsOptional()
  details: AdDetailsType;

  @IsString()
  @IsOptional()
  youtubeLink: string;

  @IsArray()
  @IsOptional()
  coordinates: number[];

  @IsBoolean()
  @IsOptional()
  isRoundTheClock: boolean;

  @IsBoolean()
  @IsOptional()
  isFullDay: boolean;

  @IsArray()
  @IsOptional()
  startTime: string[];

  @IsBoolean()
  @IsOptional()
  isDuration: boolean;

  @IsString()
  @IsOptional()
  duration: string;

  @IsBoolean()
  @IsOptional()
  isBlocked: boolean;

  @IsBoolean()
  @IsOptional()
  isComplete: boolean;
}
