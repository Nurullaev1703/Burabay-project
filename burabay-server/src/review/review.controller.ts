import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AllReviewParams } from './types/all-review.params';

@ApiTags('Отзывы на объявления')
@ApiBearerAuth()
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Request() req: AuthRequest, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto, req.user);
  }

  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.reviewService.findAll(req.user);
  }

  @Get('all')
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Количество получаемых записей',
    type: Number,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Количетсво пропускаемых записей',
    type: Number,
  })
  findAllReviews(@Query() params: AllReviewParams) {
    return this.reviewService.findAllReviews(params);
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
