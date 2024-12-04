import { IsAlphanumeric } from "class-validator";

export class UpdatePasswordDto{
    @IsAlphanumeric()
    oldPassword:string

    @IsAlphanumeric()
    newPassword:string
}