import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';
import { BanUserDto } from './dto/ban-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersFilter } from './types/admin-panel-filters.type';

@Controller('admin')
@ApiTags('Админ Панель')
@ApiBearerAuth()
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @Get('statistic')
  async getStats() {
    return this.adminPanelService.getStats();
  }

  @Get('reports')
  async getReports() {
    return this.adminPanelService.getReports();
  }

  @Get('users')
  async getUsers(@Query() filter: UsersFilter) {
    return this.adminPanelService.getUsers(filter);
  }

  @Patch('check-org/:orgId')
  async checkOrg(@Param('orgId') orgId: string) {
    return this.adminPanelService.checkOrg(orgId);
  }

  @Patch('ban-tourist/:userId')
  async banToursit(@Param('userId') userId: string, @Body() banUserDto: BanUserDto) {
    return this.adminPanelService.banTourist(userId, banUserDto.value);
  }

  @Patch('check-review/:reviewId')
  async checkReview(@Param('reviewId') reviewId: string) {
    return this.adminPanelService.checkReview(reviewId);
  }

  @Patch('ban-tourist/:userId')
  async banOrg(@Param('userId') userId: string, @Body() banUserDto: BanUserDto) {
    return this.adminPanelService.banTourist(userId, banUserDto.value);
  }
}
