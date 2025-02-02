import { IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../types/notification.type';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;
}
