import { IsString, IsOptional } from 'class-validator';

export class UpdateScheduleDto {
  @IsString()
  @IsOptional()
  monStart: string;

  @IsString()
  @IsOptional()
  monEnd: string;

  @IsString()
  @IsOptional()
  tueStart: string;

  @IsString()
  @IsOptional()
  tueEnd: string;

  @IsString()
  @IsOptional()
  wenStart: string;

  @IsString()
  @IsOptional()
  wenEnd: string;

  @IsString()
  @IsOptional()
  thuStart: string;

  @IsString()
  @IsOptional()
  thuEnd: string;

  @IsString()
  @IsOptional()
  friStart: string;

  @IsString()
  @IsOptional()
  friEnd: string;

  @IsString()
  @IsOptional()
  satStart: string;

  @IsString()
  @IsOptional()
  satEnd: string;

  @IsString()
  @IsOptional()
  sunStart: string;

  @IsString()
  @IsOptional()
  sunEnd: string;
}
