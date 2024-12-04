import { IsOptional } from "class-validator"
export class UpdateAddresssDto{
    @IsOptional()
    region?: string

    @IsOptional()
    city?: string

    @IsOptional()
    street?:string
}