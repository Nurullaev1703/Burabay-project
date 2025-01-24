import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';

@ApiTags('Аналитика')
@ApiBearerAuth()
@Public() // TODO Удалить после тестирования.
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('report')
  async getAnalyticsReport(
    @Query('viewId') viewId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getReport(viewId, startDate, endDate);
  }
  @Get('detailed-report')
  async getDetailedAnalyticsReport(
    @Query('viewId') viewId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getDetailedReport(viewId, startDate, endDate);
  }
}
