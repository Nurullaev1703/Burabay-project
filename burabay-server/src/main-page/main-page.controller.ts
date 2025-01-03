import { Controller, Get, Query } from '@nestjs/common';
import { MainPageService } from './main-page.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';
import { AdFilter } from 'src/ad/types/ad.filter';

@Controller('main-pages')
export class MainPageController {
  constructor(private readonly mainPageService: MainPageService) {}

  @Get()
  @ApiBearerAuth()
  @ApiTags('Главная страница')
  @Public()
  getMainPage(@Query() filter: AdFilter) {
    return this.mainPageService.getMainPage(filter);
  }
}
