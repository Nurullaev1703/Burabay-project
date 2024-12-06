import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

export class CreateEmployeeDto{
    @IsPhoneNumber()
    phoneNumber:string

    @IsString()
    fullName:string
    
    @IsEmail()
    email:string
}