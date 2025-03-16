import { Module } from '@nestjs/common';
import { MainPageController } from './main-page.controller';
import { MainPageService } from './main-page.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Category } from 'src/category/entities/category.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Banner } from 'src/admin-panel/entities/baner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, Category, Booking, Banner])],
  controllers: [MainPageController],
  providers: [MainPageService],
})
export class MainPageModule {}
