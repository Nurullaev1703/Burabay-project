import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

/** Сервис для выполнения фоновых задач */
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  /** Удаление устаревших баннеров */
  @Cron('0 0 * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 0');
  }
}
