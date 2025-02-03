import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../types/notification.type';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;
}
