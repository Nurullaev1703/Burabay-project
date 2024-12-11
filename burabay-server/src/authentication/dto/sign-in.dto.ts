import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ROLE_TYPE } from 'src/users/types/user-types';

export class SignInDto {
  @IsOptional()
  @IsNotEmpty()
  role?: ROLE_TYPE;

  @IsOptional()
  @IsString()
  password?: ROLE_TYPE;

  @IsEmail()
  email: string;
}
