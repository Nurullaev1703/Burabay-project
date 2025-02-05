import { Controller, Get, Query } from '@nestjs/common';
import { MainPageService } from './main-page.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';
import { AdFilter } from 'src/ad/types/ad.filter';

@Controller('main-pages')
export class MainPageController {
  constructor(private readonly mainPageService: MainPageService) {}

  @Get('/announcements')
  @ApiBearerAuth()
  @ApiTags('Объявления главной')
  @Public()
  getMainPageAnnouncements(@Query() filter: AdFilter) {
    return this.mainPageService.getMainPageAnnouncements(filter);
  }
  @Get('/categories')
  @ApiBearerAuth()
  @ApiTags('Категории главной')
  @Public()
  getMainPageCategories() {
    return this.mainPageService.getMainPageCategories();
  }
}
