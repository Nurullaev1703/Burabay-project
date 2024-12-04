import { Type } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString, ValidateNested } from 'class-validator';
import { POSITION_TYPE } from 'src/users/types/user-types';
import { UpdateOrganizationDto } from './update-organization.dto';
import { UpdateAddresssDto } from './update-address.dto';
export class UpdateProfileDto {
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  iin?: string;
  
  @IsOptional()
  @IsString()
  managerId?: string;

  @IsOptional()
  position?: POSITION_TYPE;

  // при обновлении других таблиц
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddresssDto)
  address?: UpdateAddresssDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateOrganizationDto)
  organization?: UpdateOrganizationDto;
}
