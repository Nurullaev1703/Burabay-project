import { IsNotEmpty } from "class-validator";

export class ResetPasswordDto{
    @IsNotEmpty()
    password:string

    @IsNotEmpty()
    token: string
}