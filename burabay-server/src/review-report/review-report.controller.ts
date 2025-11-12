import { Controller, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
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
  update(@Param('id') id: string, @Body() updateReviewReportDto: UpdateReviewReportDto, @Request() req: AuthRequest) {
    return this.reviewReportService.update(id, updateReviewReportDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.reviewReportService.remove(id, req.user);
  }
}
