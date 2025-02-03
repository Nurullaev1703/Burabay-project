import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateNotificationDto } from './create-notification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;
}
