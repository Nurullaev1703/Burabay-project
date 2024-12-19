import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';

@Controller('feedback')
@ApiBearerAuth()
@ApiTags('Отзывы на приложение')
@Public() // TODO Удалить после тестирования.
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.feedbackService.findOneByUser(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
