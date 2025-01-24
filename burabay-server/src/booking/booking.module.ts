import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { Ad } from 'src/ad/entities/ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Booking, Ad])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
