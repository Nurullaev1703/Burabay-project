import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  CreateAllNotificationDto,
  CreateCategoryNotificationDto,
} from './dto/create-all-notifications.dto';
import { CreatePushTokenDto } from './dto/create-pushToken.dto';

@ApiBearerAuth()
@ApiTags('Уведомления')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/user')
  createForUser(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createForUser(createNotificationDto);
  }

  @Post('/pushToken')
  createPushToken(@Body() createPushTokenDto: CreatePushTokenDto, @Request() req: AuthRequest) {
    return this.notificationService.createPushToken(createPushTokenDto, req.user);
  }

  @Post('/all')
  createForAll(@Body() createAllNotificationDto: CreateAllNotificationDto) {
    return this.notificationService.createForAll(createAllNotificationDto);
  }

  @Post('/tourists')
  createForTourists(@Body() dto: CreateAllNotificationDto) {
    return this.notificationService.createForTourists(dto);
  }

  @Post('/organizations')
  createForOrganizations(@Body() dto: CreateAllNotificationDto) {
    return this.notificationService.createForOrganizations(dto);
  }

  @Post('/category')
  createForCategory(@Body() dto: CreateCategoryNotificationDto) {
    return this.notificationService.createForCategory(dto);
  }

  @Get('/all')
  findForAll() {
    return this.notificationService.findForAll();
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
