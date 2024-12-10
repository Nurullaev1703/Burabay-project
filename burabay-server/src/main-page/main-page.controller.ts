import { Controller, Get } from '@nestjs/common';
import { MainPageService } from './main-page.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';

@Controller('main-pages')
export class MainPageController {
  constructor(private readonly mainPageService: MainPageService) {}

  @Get()
  @ApiBearerAuth()
  @ApiTags('Главная страница')
  @Public()
  getMainPage() {
    return this.mainPageService.getMainPage();
  }
}
