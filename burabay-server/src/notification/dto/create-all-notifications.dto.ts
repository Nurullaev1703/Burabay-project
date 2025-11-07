import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../types/notification.type';

export class CreateAllNotificationDto {
  @IsString()
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class CreateCategoryNotificationDto {
  @IsString()
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsArray()
  @IsOptional()
  categoryIds?: string[];
}
