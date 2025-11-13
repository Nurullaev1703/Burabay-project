import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { BreaksService } from './breaks.service';
import { CreateBreakDto } from './dto/create-break.dto';
import { UpdateBreakDto } from './dto/update-break.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('breaks')
@ApiBearerAuth()
@ApiTags('Перерыв')
export class BreaksController {
  constructor(private readonly breaksService: BreaksService) {}

  @Post()
  @ApiBody({ schema: { example: BreaksController.exampleCreateAd } })
  create(@Body() createBreakDto: CreateBreakDto[], @Request() req: AuthRequest) {
    return this.breaksService.create(createBreakDto, req.user);
  }

  @Get(':adId')
  findAllByAd(@Param('adId') adId: string) {
    return this.breaksService.findAllByAd(adId);
  }

  @Patch(':adId')
  @ApiBody({ schema: { example: BreaksController.exampleUpdate } })
  update(@Param('adId') adId: string, @Body() updateBreakDto: UpdateBreakDto[], @Request() req: AuthRequest) {
    return this.breaksService.update(adId, updateBreakDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.breaksService.remove(id, req.user);
  }

  private static exampleCreateAd = [
    {
      'adId': 'string',
      'start': '13:00',
      'end': '14:00',
    },
    {
      'adId': 'string',
      'start': '16:00',
      'end': '16:30',
    },
  ];

  private static exampleUpdate = [
    {
      'start': '13:00',
      'end': '14:00',
    },
    {
      'start': '16:00',
      'end': '16:30',
    },
  ];
}
