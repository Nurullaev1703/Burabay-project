import { Controller, Get, Query, Request } from '@nestjs/common';
import { MainPageService } from './main-page.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';
import { AdFilter } from 'src/ad/types/ad-filter.type';
import { MainPageFilter } from './types/main-page-filters.type';

@Controller('main-pages')
@ApiTags('Главная страница')
export class MainPageController {
  constructor(private readonly mainPageService: MainPageService) {}

  @Get('/announcements')
  @ApiBearerAuth()
  @Public()
  getMainPageAnnouncements(@Query() filter: AdFilter) {
    return this.mainPageService.getMainPageAnnouncements(filter);
  }
  @Get('/categories')
  @ApiBearerAuth()
  @Public()
  getMainPageCategories() {
    return this.mainPageService.getMainPageCategories();
  }

  @Get('/ad')
  @ApiBearerAuth()
  getMainPageAd(@Request() req: AuthRequest, @Query() filter?: MainPageFilter) {
    return this.mainPageService.getMainPageAds(req.user, filter);
  }

  @Get('/banners')
  @ApiBearerAuth()
  getBanners() {
    return this.mainPageService.getBanners();
  }
}
