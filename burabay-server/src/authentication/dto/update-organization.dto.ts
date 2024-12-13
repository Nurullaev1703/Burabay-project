import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsEmail()
  email: string;

  @IsString()
  orgName: string

  @IsString()
  description: string

  @IsOptional()
  @IsString()
  siteUrl?: string
}
