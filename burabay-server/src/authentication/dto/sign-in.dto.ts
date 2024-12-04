import { IsNotEmpty, IsPhoneNumber } from "class-validator"
import { ROLE_TYPE } from "src/users/types/user-types"

export class SignInDto {
    @IsPhoneNumber()
    phoneNumber:string

    @IsNotEmpty()
    role:ROLE_TYPE

    @IsNotEmpty()
    authPoint: string
}
