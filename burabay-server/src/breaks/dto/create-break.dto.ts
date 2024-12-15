import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBreakDto {
  @IsString()
  @IsNotEmpty()
  adId: string;

  @IsString()
  @IsNotEmpty()
  start: string;

  @IsString()
  @IsNotEmpty()
  end: string;
}
