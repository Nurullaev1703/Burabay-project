import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber, IsString, ValidateNested } from 'class-validator';
import { UpdateOrganizationDto } from './update-organization.dto';

export class UpdateProfileDto {
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isEmailConfirmed?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateOrganizationDto)
  organization?: UpdateOrganizationDto;
}
