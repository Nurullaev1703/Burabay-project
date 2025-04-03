import { Controller, Get } from '@nestjs/common';
import { Public } from './constants';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('ping')
@ApiTags('Ping')
@ApiBearerAuth()
export class AppController {
  @Get()
  @Public()
  @ApiOperation({ summary: 'Запрос для проверки доступности сервера' })
  getHello(): string {
    return 'Hello World!';
  }
}
