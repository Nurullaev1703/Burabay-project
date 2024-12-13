import { IsEmail, IsNotEmpty } from 'class-validator';
import { ROLE_TYPE } from 'src/users/types/user-types';

export class LoginDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
