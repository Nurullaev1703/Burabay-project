import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}
