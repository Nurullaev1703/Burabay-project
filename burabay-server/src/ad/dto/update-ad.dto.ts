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
  unlimitedClients: boolean;

  @IsNumber()
  @IsOptional()
  adultsNumber: number;

  @IsNumber()
  @IsOptional()
  kidsNumber: number;

  @IsNumber()
  @IsOptional()
  kidsMinAge: number;

  @IsBoolean()
  @IsOptional()
  petsAllowed: boolean;

  @IsBoolean()
  @IsOptional()
  isBookable: boolean;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  priceForChild: number;

  @IsBoolean()
  @IsOptional()
  onSitePayment: boolean;

  @IsBoolean()
  @IsOptional()
  onlinePayment: boolean;

  @IsBoolean()
  @IsOptional()
  isBlocked: boolean;

  @IsBoolean()
  @IsOptional()
  isComplete: boolean;
}
