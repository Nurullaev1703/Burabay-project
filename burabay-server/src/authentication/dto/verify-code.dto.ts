import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class VerifyCodeDto{
    @IsPhoneNumber()
    phone: string
    
    @IsNotEmpty()
    code: string
}