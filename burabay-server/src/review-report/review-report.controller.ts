import { Controller, Get, Post, Body, Patch, Param, Delete, Injectable, Request } from '@nestjs/common';
import { ReviewReportService } from './review-report.service';
import { CreateReviewReportDto } from './dto/create-review-report.dto';
import { UpdateReviewReportDto } from './dto/update-review-report.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Ответы на жалобы')
@Controller('review-report')
export class ReviewReportController {
  constructor(private readonly reviewReportService: ReviewReportService) {}

  @Post()
  create(@Body() createReviewReportDto: CreateReviewReportDto, @Request() req: AuthRequest) {
      return this.reviewReportService.create(createReviewReportDto, req.user);
    }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewReportDto: UpdateReviewReportDto) {
    return this.reviewReportService.update(id, updateReviewReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewReportService.remove(id);
  }
}
