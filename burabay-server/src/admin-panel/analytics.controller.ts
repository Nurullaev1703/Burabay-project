import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';

@ApiTags('Админ Панель')
@ApiBearerAuth()
@Public() // TODO Удалить после тестирования.
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('user-report')
  async getUserStatistics() {
    return this.analyticsService.getStatistic();
  }

  @Get('pages-report')
  async getPagesStatistics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getPageViews(startDate, endDate);
  }
}
