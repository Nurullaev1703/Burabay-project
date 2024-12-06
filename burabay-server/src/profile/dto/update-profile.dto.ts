import { Type } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString, ValidateNested } from 'class-validator';
import { UpdateOrganizationDto } from './update-organization.dto';

export class UpdateProfileDto {
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateOrganizationDto)
  organization?: UpdateOrganizationDto;
}
