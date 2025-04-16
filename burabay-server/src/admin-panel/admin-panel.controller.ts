import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';
import { BanUserDto } from './dto/ban-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersFilter } from './types/admin-panel-filters.type';
import { Public } from 'src/constants';
import { BannerCreateDto } from './dto/banner-create.dto';

@Controller('admin')
@ApiTags('Админ Панель')
@ApiBearerAuth()
@Public() // TODO Удалить после тестирования.
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @Post('banner')
  async createBanner(@Body() dto: BannerCreateDto) {
    return this.adminPanelService.createBanner(dto);
  }

  @Get('statistic')
  async getStats() {
    return this.adminPanelService.getStats();
  }

  @Get('reports')
  async getReports() {
    return this.adminPanelService.getReports();
  }

  @Get('users')
  @ApiQuery({
    name: 'take',
    description: 'Количество получаемых записей',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'skip',
    description: 'Количество пропускаемых записей',
    required: false,
    type: Number,
  })
  async getUsers(@Query() filter: UsersFilter) {
    return this.adminPanelService.getUsers(filter);
  }

  @Get('org-info/:orgId')
  async getOrgInfo(@Param('orgId') orgId: string) {
    return this.adminPanelService.getOrgInfo(orgId);
  }

  @Get('tourist-info/:userId')
  async getTouristInfo(@Param('userId') userId: string) {
    return this.adminPanelService.getTouristInfo(userId);
  }

  @Patch('check-org/:orgId')
  async checkOrg(@Param('orgId') orgId: string) {
    return this.adminPanelService.checkOrg(orgId);
  }

  @Patch('cancel-org/:orgId')
  async cancelCheckOrg(@Param('orgId') orgId: string) {
    return this.adminPanelService.cancelCheckOrg(orgId);
  }

  @Patch('ban-tourist/:userId')
  async banToursit(@Param('userId') userId: string, @Body() banUserDto: BanUserDto) {
    return this.adminPanelService.banTourist(userId, banUserDto.value);
  }

  @Patch('check-review/:reviewId')
  async checkReview(@Param('reviewId') reviewId: string) {
    return this.adminPanelService.checkReview(reviewId);
  }

  @Patch('ban-org/:orgId')
  async banOrg(@Param('orgId') orgId: string, @Body() banUserDto: BanUserDto) {
    return this.adminPanelService.banOrg(orgId, banUserDto.value);
  }

  @Delete('banner/:bannerId')
  async deleteBanner(@Param('bannerId') bannerId: string) {
    return this.adminPanelService.deleteBanner(bannerId);
  }
}
