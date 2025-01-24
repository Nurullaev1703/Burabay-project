import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentType } from '../types/payment.type';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
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
}
