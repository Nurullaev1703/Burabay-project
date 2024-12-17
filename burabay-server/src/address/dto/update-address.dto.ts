import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  adId: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  specialName: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
