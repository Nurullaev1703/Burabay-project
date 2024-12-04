import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRequisitiesDto {
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  identityCode: string;

  @IsNotEmpty()
  @IsString()
  bankCode: string;
  
  @IsNotEmpty()
  @IsString()
  benCode: string;
}
