import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingBanDateService } from './booking-ban-date.service';
import { CreateBookingBanDateDto } from './dto/create-booking-ban-date.dto';
import { UpdateBookingBanDateDto } from './dto/update-booking-ban-date.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';

@ApiBearerAuth()
@ApiTags('Заблокированные даты для брони')
@Public() // TODO Удалить после тестирования.
@Controller('booking-ban-date')
export class BookingBanDateController {
  constructor(private readonly bookingBanDateService: BookingBanDateService) {}

  @Post()
  create(@Body() createBookingBanDateDto: CreateBookingBanDateDto) {
    return this.bookingBanDateService.create(createBookingBanDateDto);
  }

  @Get(':adId')
  findAllByAd(@Param('adId') adId: string) {
    return this.bookingBanDateService.findAllByAd(adId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingBanDateDto: UpdateBookingBanDateDto) {
    return this.bookingBanDateService.update(id, updateBookingBanDateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingBanDateService.remove(id);
  }
}
