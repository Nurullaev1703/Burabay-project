import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, Req } from '@nestjs/common';
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
  findAllByUser(@Request() req: AuthRequest, @Query() filter?: BookingFilter) {
    return this.bookingService.findAllByUserId(req.user, filter);
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
    @Request() req: AuthRequest,
  ) {
    return this.bookingService.getAllByAdId(adId, date, req.user, filter);
  }

  @Get('has-active/:adId')
  hasActiveBookings(@Param('adId') adId: string) {
    return this.bookingService.hasActiveBookings(adId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.bookingService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto, @Request() req: AuthRequest) {
    return this.bookingService.update(id, updateBookingDto, req.user);
  }

  @Patch(':id/cancel')
  bookingCancel(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.bookingService.bookingCancel(id, req.user);
  }

  @Patch(':id/confirm')
  bookingConfirm(@Param('id') id: string, @Request() request: AuthRequest) {
    return this.bookingService.bookingConfirm(id, request.user);
  }

  @Patch(':id/payed')
  bookingPayed(@Param('id') id: string, @Request() request: AuthRequest) {
    return this.bookingService.bookingPayed(id, request.user);
  }

  @Patch(':id/done')
  bookingDone(@Param('id') id: string, @Request() request: AuthRequest) {
    return this.bookingService.bookingDone(id, request.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: AuthRequest) {
    return this.bookingService.remove(id, request.user);
  }

  static createBookingExample = {
    'user': 'string',
  };
}
