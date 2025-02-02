import { Controller, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ReviewAnswersService } from './review-answers.service';
import { CreateReviewAnswerDto } from './dto/create-review-answer.dto';
import { UpdateReviewAnswerDto } from './dto/update-review-answer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('review-answers')
@ApiBearerAuth()
@ApiTags('Ответы на отзывы')
export class ReviewAnswersController {
  constructor(private readonly reviewAnswersService: ReviewAnswersService) {}

  @Post()
  create(@Body() createReviewAnswerDto: CreateReviewAnswerDto, @Request() req: AuthRequest) {
    return this.reviewAnswersService.create(createReviewAnswerDto, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewAnswerDto: UpdateReviewAnswerDto) {
    return this.reviewAnswersService.update(id, updateReviewAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewAnswersService.remove(id);
  }
}
