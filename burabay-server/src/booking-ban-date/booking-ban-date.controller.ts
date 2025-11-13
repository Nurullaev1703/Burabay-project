import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { BookingBanDateService } from './booking-ban-date.service';
import { CreateBookingBanDateDto } from './dto/create-booking-ban-date.dto';
import { UpdateBookingBanDateDto } from './dto/update-booking-ban-date.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Заблокированные даты для брони')
@Controller('booking-ban-date')
export class BookingBanDateController {
  constructor(private readonly bookingBanDateService: BookingBanDateService) {}

  @Post()
  @ApiBody({ schema: { example: BookingBanDateController.createExample } })
  create(@Body() createBookingBanDateDto: CreateBookingBanDateDto[], @Request() req: AuthRequest) {
    return this.bookingBanDateService.create(createBookingBanDateDto, req.user);
  }

  @Get(':adId')
  findAllByAd(@Param('adId') adId: string) {
    return this.bookingBanDateService.findAllByAd(adId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingBanDateDto: UpdateBookingBanDateDto, @Request() req: AuthRequest) {
    return this.bookingBanDateService.update(id, updateBookingBanDateDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.bookingBanDateService.remove(id, req.user);
  }

  private static createExample = [
    {
      'adId': 'string',
      'date': '25.12.24',
      'allDay': false,
      'times': ['9:00', '11:00', '13:00'],
    },
    {
      'adId': 'string',
      'date': '26.12.24',
      'allDay': true,
    },
  ];
}
