import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class UpdateBookingBanDateDto {
  @IsOptional()
  @IsString()
  date: string;

  @IsOptional()
  @IsBoolean()
  allDay: boolean;

  @IsOptional()
  @IsArray()
  times: string[];
}
