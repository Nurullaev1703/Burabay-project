import { Module } from '@nestjs/common';
import { MainPageController } from './main-page.controller';
import { MainPageService } from './main-page.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ad/entities/ad.entity';
import { Category } from 'src/category/entities/category.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, Category, Booking])],
  controllers: [MainPageController],
  providers: [MainPageService],
})
export class MainPageModule {}
