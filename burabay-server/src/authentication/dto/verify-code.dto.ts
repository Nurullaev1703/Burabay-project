import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class VerifyCodeDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;
}