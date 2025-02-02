import { PartialType } from '@nestjs/swagger';
import { CreateReviewReportDto } from './create-review-report.dto';

export class UpdateReviewReportDto extends PartialType(CreateReviewReportDto) {}
