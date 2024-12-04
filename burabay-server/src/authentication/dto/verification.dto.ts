import { IsPhoneNumber } from "class-validator";

export class VerificationDto{
    @IsPhoneNumber()
    phone: string
}