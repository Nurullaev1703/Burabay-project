import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BreaksService } from './breaks.service';
import { CreateBreakDto } from './dto/create-break.dto';
import { UpdateBreakDto } from './dto/update-break.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';

@Controller('breaks')
@ApiBearerAuth()
@Public() // TODO Удалить после тестирования.
@ApiTags('Перерыв')
export class BreaksController {
  constructor(private readonly breaksService: BreaksService) {}

  @Post()
  create(@Body() createBreakDto: CreateBreakDto) {
    return this.breaksService.create(createBreakDto);
  }

  @Get(':adId')
  findAllByAd(@Param('adId') adId: string) {
    return this.breaksService.findAllByAd(adId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBreakDto: UpdateBreakDto) {
    return this.breaksService.update(id, updateBreakDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.breaksService.remove(id);
  }
}
