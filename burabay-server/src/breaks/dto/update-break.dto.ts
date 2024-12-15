import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBreakDto {
  @IsString()
  @IsNotEmpty()
  start: string;

  @IsString()
  @IsNotEmpty()
  end: string;
}
