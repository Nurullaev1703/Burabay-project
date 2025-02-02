import { Module } from '@nestjs/common';
import { AdminPanelController } from './admin-panel.controller';
import { AdminPanelService } from './admin-panel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, Ad, Review, Booking])],
  controllers: [AdminPanelController],
  providers: [AdminPanelService],
  exports: [],
})
export class AdminPanelModule {}
