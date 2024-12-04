import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator"
import { ROLE_TYPE, POSITION_TYPE, PERMISSIONS_TYPE } from "../types/user-types"

export class UpdateEmployeeDto{
    @IsOptional()
    @IsPhoneNumber()
    phoneNumber?:string

    @IsOptional()
    position?: POSITION_TYPE

    @IsOptional()
    @IsString()
    fullName?:string
    
    @IsOptional()
    @IsEmail()
    email?:string

    @IsOptional()
    permissions?:{
        createOrders: boolean,
        signContracts: boolean,
        editProducts: boolean;
        editEmployees: boolean
    }
}