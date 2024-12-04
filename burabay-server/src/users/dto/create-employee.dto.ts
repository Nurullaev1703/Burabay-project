import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"
import { PERMISSIONS_TYPE, POSITION_TYPE } from "../types/user-types"

export class CreateEmployeeDto{
    @IsPhoneNumber()
    phoneNumber:string

    @IsString()
    position: POSITION_TYPE

    @IsString()
    fullName:string
    
    @IsEmail()
    email:string

    @IsNotEmpty()
    permissions:{
        createOrders : boolean,
        signContracts: boolean,
        editProducts: boolean;
        editEmployees: boolean
    }
}