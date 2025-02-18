import { Controller, Get, Post, Body, Patch, Delete, Request } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('feedback')
@ApiBearerAuth()
@ApiTags('Отзывы на приложение')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto, @Request() req: AuthRequest) {
    return this.feedbackService.create(createFeedbackDto, req.user);
  }

  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get('user')
  findOne(@Request() req: AuthRequest) {
    return this.feedbackService.findOneByUser(req.user);
  }

  @Patch()
  update(@Body() updateFeedbackDto: UpdateFeedbackDto, @Request() req: AuthRequest) {
    return this.feedbackService.update(updateFeedbackDto, req.user);
  }

  @Delete()
  remove(@Request() req: AuthRequest) {
    return this.feedbackService.remove(req.user);
  }
}
