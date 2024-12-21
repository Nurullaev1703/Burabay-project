import { Controller, Get, Render } from '@nestjs/common';
import { Public } from 'src/constants';

@Controller('admin')
@Public()
export class AdminPanelController {
  @Get()
  @Render('activity')
  activity() {
    return {
      'title': 'Burabay Admin | Активность в приложении',
      'topTitle': 'Активность',
    };
  }
}
