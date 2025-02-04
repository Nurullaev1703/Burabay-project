import { IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../types/notification.type';

export class CreateAllNotificationDto {
  @IsString()
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;
}