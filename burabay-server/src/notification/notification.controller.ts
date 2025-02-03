import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';

@ApiBearerAuth()
@ApiTags('Уведомления')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/user')
  createForUser(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createForUser(createNotificationDto);
  }

  @Post('/all')
  createForAll(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createForAll(createNotificationDto);
  }

  @Get('/all')
  findForAllUsers(@Request() req: AuthRequest) {
    return this.notificationService.findForAllUsers(req.user);
  }

  @Get('/user')
  findForUser(@Request() req: AuthRequest) {
    return this.notificationService.findForUser(req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
