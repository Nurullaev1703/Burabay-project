import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator"
import { ROLE_TYPE } from "src/users/types/user-types"

export class SignInDto {
    @IsNotEmpty()
    role:ROLE_TYPE

    @IsNotEmpty()
    @IsEmail()
    email: string
}
