import { IsNotEmpty, IsString } from "class-validator";

export class CreateReviewReportDto {
    @IsString()
    @IsNotEmpty()
    reviewId: string;
    
    @IsString()
    @IsNotEmpty()
    text: string;
}
