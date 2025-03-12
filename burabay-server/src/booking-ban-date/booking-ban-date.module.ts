import { Module } from '@nestjs/common';
import { BookingBanDateService } from './booking-ban-date.service';
import { BookingBanDateController } from './booking-ban-date.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingBanDate } from './entities/booking-ban-date.entity';
import { Ad } from 'src/ad/entities/ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, BookingBanDate])],
  controllers: [BookingBanDateController],
  providers: [BookingBanDateService],
  exports: [BookingBanDateService],
})
export class BookingBanDateModule {}
