import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateAllNotificationDto } from './create-all-notifications.dto';

export class UpdateNotificationDto extends PartialType(CreateAllNotificationDto) {
  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;
}
