import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';

@ApiTags('Отзывы на объявления')
@ApiBearerAuth()
// @Public() // TODO удалить после тестирования.
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Request() req: AuthRequest, @Body() createReviewDto: CreateReviewDto) {
    console.log(req);
    return this.reviewService.create(createReviewDto, req.user);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('ad/:adId')
  findAllByAd(@Param('adId') adId: string) {
    return this.reviewService.findAllByAd(adId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
