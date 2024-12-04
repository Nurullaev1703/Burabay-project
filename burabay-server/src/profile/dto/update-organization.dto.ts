import { IsOptional } from "class-validator"

export class UpdateOrganizationDto{
    @IsOptional()
    imgUrl?: string

    @IsOptional()
    name?: string

    @IsOptional()
    type?: string

    @IsOptional()
    identityNumber?:string
}