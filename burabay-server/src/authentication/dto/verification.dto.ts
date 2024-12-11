import { IsEmail } from "class-validator";

export class VerificationDto{
    @IsEmail()
    email: string
}