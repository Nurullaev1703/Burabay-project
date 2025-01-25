import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { BookingFilter } from './types/booking.types';

@Controller('booking')
@ApiBearerAuth()
@ApiTags('Бронирование')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiBody({
    description: 'Создание бронирования. Поле paymentType принимает значения cash или online',
    type: CreateBookingDto,
  })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req: AuthRequest) {
    return this.bookingService.create(createBookingDto, req.user);
  }

  @Get()
  findAllByUser(@Request() req: AuthRequest) {
    return this.bookingService.findAllByUserId(req.user);
  }

  @Get('org')
  findAllByOrg(@Request() req: AuthRequest, @Query() filter: BookingFilter) {
    return this.bookingService.findAllByOrgId(req.user, filter);
  }

  @Get('by-ad/:adId/:date')
  findAllByAdId(
    @Param('adId') adId: string,
    @Param('date') date: string,
    @Query() filter: BookingFilter,
  ) {
    return this.bookingService.getAllByAdId(adId, date, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }

  static createBookingExample = {
    'user': 'string',
  };
}
