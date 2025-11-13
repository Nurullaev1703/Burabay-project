import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { FirebaseAdminService } from './firebase-admin.service';
import { EmailModule } from 'src/authentication/email.module';

@Module({
  imports:[TypeOrmModule.forFeature([User, Notification]), EmailModule],
  controllers: [NotificationController],
  providers: [NotificationService, FirebaseAdminService],
  exports: [NotificationService],
})
export class NotificationModule {}
