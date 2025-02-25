import { IsNotEmpty, IsString } from 'class-validator';


export class CreatePushTokenDto {
  @IsString()
  @IsNotEmpty()
  pushToken: string;
}
