import { Module } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from './entities/ad.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { BookingBanDate } from 'src/booking-ban-date/entities/booking-ban-date.entity';
import { Break } from 'src/breaks/entities/break.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ad,
      Subcategory,
      Booking,
      Organization,
      User,
      Schedule,
      BookingBanDate,
      Break,
    ]),
  ],
  controllers: [AdController],
  providers: [AdService],
})
export class AdModule {}
