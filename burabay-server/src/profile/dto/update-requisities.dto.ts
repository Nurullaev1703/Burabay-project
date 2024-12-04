import { IsOptional, IsString } from 'class-validator';

export class UpdateRequisitiesDto {
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  identityCode?: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsString()
  benCode?: string;
}
