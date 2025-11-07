import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AdminPanelService } from 'src/admin-panel/admin-panel.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminPanelService,
  ) {}
  /* Этот метод выполняет вложенный код каждые 24 часа. */
  @Cron('0 0 * * *')
  async handleCron() {
    // Удаление пользователей с пустыми паролями
    this.userService.deleteEmptyPasswordUsers();
    // Удаление организаций и пользователей с пустыми именами
    this.userService.deleteOrganizationsAndUsers();
    // Удаление устаревших баннеров
    this.adminService.deleteExpiredBanners();
    // Отмена просроченных не принятых заказов
    
  }
}
