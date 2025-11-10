import { Controller, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ТЕСТ ЕЖЕДНЕВНЫХ ЗАДАЧ')
@Controller('')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('test-daily-tasks')
  async testDailyTasks() {
    return await this.tasksService.handleCron();
  }
}
