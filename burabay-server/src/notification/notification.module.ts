import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { FirebaseAdminService } from './firebase-admin.service';

@Module({
  imports:[TypeOrmModule.forFeature([User, Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, FirebaseAdminService],
})
export class NotificationModule {}
