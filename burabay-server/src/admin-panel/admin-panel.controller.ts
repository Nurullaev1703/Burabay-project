import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request } from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';
import { BanUserDto } from './dto/ban-user.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersFilter } from './types/admin-panel-filters.type';
import { Public } from 'src/constants';
import { BannerCreateDto } from './dto/banner-create.dto';

@Controller('admin')
@ApiTags('Админ Панель')
@ApiBearerAuth()
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @Post('banner')
  async createBanner(@Body() dto: BannerCreateDto, @Request() req: AuthRequest) {
    return this.adminPanelService.createBanner(dto, req.user.id);
  }

  @Get('statistic')
  async getStats(@Request() req: AuthRequest) {
    return this.adminPanelService.getStats(req.user.id);
  }

  @Get('reports')
  async getReports(@Request() req: AuthRequest) {
    return this.adminPanelService.getReports(req.user.id);
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
  async getUsers(@Query() filter: UsersFilter, @Request() req: AuthRequest) {
    return this.adminPanelService.getUsers(req.user.id, filter);
  }

  @Get('org-info/:orgId')
  async getOrgInfo(@Param('orgId') orgId: string, @Request() req: AuthRequest) {
    return this.adminPanelService.getOrgInfo(orgId, req.user.id);
  }

  @Get('tourist-info/:userId')
  async getTouristInfo(@Param('userId') userId: string, @Request() req: AuthRequest) {
    return this.adminPanelService.getTouristInfo(userId, req.user.id);
  }

  @Patch('check-org/:orgId')
  async checkOrg(@Param('orgId') orgId: string, @Request() req: AuthRequest) {
    return this.adminPanelService.checkOrg(orgId, req.user.id);
  }

  @Patch('cancel-org/:orgId')
  async cancelCheckOrg(@Param('orgId') orgId: string, @Request() req: AuthRequest) {
    return this.adminPanelService.cancelCheckOrg(orgId, req.user.id);
  }

  @Patch('ban-tourist/:userId')
  async banToursit(@Param('userId') userId: string, @Body() banUserDto: BanUserDto, @Request() req: AuthRequest) {
    return this.adminPanelService.banTourist(userId, banUserDto.value, req.user.id);
  }

  @Patch('check-review/:reviewId')
  async checkReview(@Param('reviewId') reviewId: string, @Request() req: AuthRequest) {
    return this.adminPanelService.checkReview(reviewId, req.user.id);
  }

  @Patch('ban-org/:orgId')
  async banOrg(@Param('orgId') orgId: string, @Body() banUserDto: BanUserDto, @Request() req: AuthRequest) {
    return this.adminPanelService.banOrg(orgId, banUserDto.value, req.user.id);
  }

  @Delete('banner/:bannerId')
  async deleteBanner(@Param('bannerId') bannerId: string, @Request() req: AuthRequest) {
    return this.adminPanelService.deleteBanner(bannerId, req.user.id);
  }
}
