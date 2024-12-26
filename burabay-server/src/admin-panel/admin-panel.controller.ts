import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Public } from 'src/constants';
import { AdminPanelService } from './admin-panel.service';
import { BanUserDto } from './dto/ban-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('Админ Панель')
@ApiBearerAuth()
@Public()
@Public()
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @Get('statistic')
  async getStats() {
    return this.adminPanelService.getStats();
  }

  @Get('tourists')
  async getTourists() {
    return this.adminPanelService.getTourists();
  }

  @Get('orgs')
  async getOrgs() {
    return this.adminPanelService.getOrgs();
  }

  @Get('ads')
  async getAds() {
    return this.adminPanelService.getAds();
  }

  @Get('reviews')
  async getReviews() {
    return this.adminPanelService.getReviews();
  }

  @Patch('ban-tourist/:userId')
  async banToursit(@Param('userId') userId: string, @Body() banUserDto: BanUserDto) {
    return this.adminPanelService.banTourist(userId, banUserDto.value);
  }

  @Patch('ban-tourist/:userId')
  async banOrg(@Param('userId') userId: string, @Body() banUserDto: BanUserDto) {
    return this.adminPanelService.banTourist(userId, banUserDto.value);
  }
}
