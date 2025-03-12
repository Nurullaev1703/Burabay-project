import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookingBanDateDto {
  @IsNotEmpty()
  @IsString()
  adId: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsBoolean()
  allDay: boolean;

  @IsOptional()
  @IsArray()
  times: string[];

  @IsOptional()
  @IsBoolean()
  isByBooking?: boolean = false;
}
