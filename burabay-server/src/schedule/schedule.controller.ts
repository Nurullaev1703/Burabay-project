import { Controller, Post, Body, Patch, Param, Delete, Get, Request } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import CreateScheduleDto from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('schedule')
@ApiBearerAuth()
@ApiTags('График работы')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto, @Request() req: AuthRequest) {
    return this.scheduleService.create(createScheduleDto, req.user);
  }

  @Get(':adId')
  findByAd(@Param('adId') adId: string) {
    return this.scheduleService.findByAd(adId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto, @Request() req: AuthRequest) {
    return this.scheduleService.update(id, updateScheduleDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.scheduleService.remove(id, req.user);
  }
}
