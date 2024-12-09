import { IsEmail, IsNotEmpty } from "class-validator";

export class VerifyCodeDto{
    @IsEmail()
    email: string
    
    @IsNotEmpty()
    code: string
}