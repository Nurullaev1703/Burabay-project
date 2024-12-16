import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

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

  @IsNotEmpty()
  @IsArray()
  times: string[];
}
