import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewAnswersService } from './review-answers.service';
import { CreateReviewAnswerDto } from './dto/create-review-answer.dto';
import { UpdateReviewAnswerDto } from './dto/update-review-answer.dto';

@Controller('review-answers')
export class ReviewAnswersController {
  constructor(private readonly reviewAnswersService: ReviewAnswersService) {}

  @Post()
  create(@Body() createReviewAnswerDto: CreateReviewAnswerDto) {
    return this.reviewAnswersService.create(createReviewAnswerDto);
  }

  @Get()
  findAll() {
    return this.reviewAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewAnswersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewAnswerDto: UpdateReviewAnswerDto) {
    return this.reviewAnswersService.update(+id, updateReviewAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewAnswersService.remove(+id);
  }
}
