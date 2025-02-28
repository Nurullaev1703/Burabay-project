import { IsOptional, IsString } from 'class-validator';

export class UpdateDocsDto {
  @IsString()
  @IsOptional()
  regCouponPath: string;

  @IsString()
  @IsOptional()
  ibanDocPath: string;

  @IsString()
  @IsOptional()
  orgRulePath: string;
}
