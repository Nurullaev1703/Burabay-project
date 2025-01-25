import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentType } from '../types/booking.types';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  adId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  date: string;

  @IsString()
  @IsOptional()
  time: string;

  @IsBoolean()
  @IsNotEmpty()
  isChildRate: boolean;

  @IsString()
  @IsNotEmpty()
  paymentType: PaymentType;

  @IsString()
  @IsOptional()
  dateStart: string;

  @IsString()
  @IsOptional()
  dateEnd: string;
}
