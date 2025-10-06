import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ROLE_TYPE } from '../types/user-types';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  role: ROLE_TYPE;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  isEmailConfirmed: boolean;
}
