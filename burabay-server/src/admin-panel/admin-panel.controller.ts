import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';
import { BanUserDto } from './dto/ban-user.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
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
    name: 'page',
    description: 'Номер страницы. Если не указана, то берется 1',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'take',
    description: 'Количество записей на странице (10, 25, 50, 100). По умолчанию 10',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'searchQuery',
    description: 'Поиск по email, номеру телефона или названию организации',
    required: false,
    type: String,
  })
  @ApiOperation({
    summary: 'Получить всех пользователей',
    description:
      'Возвращает пользователей с пагинацией. Параметр take определяет количество записей на странице (10, 25, 50, 100). Параметр page указывает номер страницы. Формула: skip = (page - 1) * take. Поиск осуществляется по email, номеру телефона и названию организации.',
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
