import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { BookingBanDateModule } from 'src/booking-ban-date/booking-ban-date.module';
import { BookingBanDate } from 'src/booking-ban-date/entities/booking-ban-date.entity';
import { NotificationService } from 'src/notification/notification.service';
import { FirebaseAdminService } from 'src/notification/firebase-admin.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Booking, Ad, Notification, BookingBanDate]),
    BookingBanDateModule,
    NotificationModule
  ],
  controllers: [BookingController],
  providers: [BookingService, FirebaseAdminService],
  exports: [BookingService],
})
export class BookingModule {}
