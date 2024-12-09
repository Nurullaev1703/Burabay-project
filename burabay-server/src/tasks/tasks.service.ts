import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from 'src/users/user.service';

@Injectable()
export class TasksService {
  constructor(private readonly userService: UserService) {}
  /* Этот метод выполняет вложенный код каждые 24 часа. */
  @Cron('0 0 * * *')
  async handleCron() {
    this.userService.deleteEmptyPasswordUsers();
    this.userService.deleteOrganizationsAndUsers();
  }
}
