import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateEmailDto{
    @IsNotEmpty()
    @IsEmail()
    email:string
}