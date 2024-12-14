import { IsOptional } from "class-validator"

export class UpdateOrganizationDto{
    @IsOptional()
    imgUrl?: string

    @IsOptional()
    name?: string

    @IsOptional()
    address?: string

    @IsOptional()
    description?:string

    @IsOptional()
    isConfirmed?:boolean

    @IsOptional()
    siteUrl?:string
}