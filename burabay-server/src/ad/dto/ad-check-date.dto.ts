import { IsNotEmpty, IsString } from 'class-validator';

export class AdCheckDateDto {
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;
}
