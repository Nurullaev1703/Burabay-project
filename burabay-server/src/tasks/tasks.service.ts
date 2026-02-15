import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AdminPanelService } from 'src/admin-panel/admin-panel.service';
import { BookingService } from 'src/booking/booking.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminPanelService,
    private readonly bookingService: BookingService,
  ) {}
  /* Этот метод выполняет вложенный код каждые 24 часа. */
  @Cron('0 0 * * *')
  async handleCron() {
    console.log('ЗАПУСК ЕЖЕДНЕВНЫХ ЗАДАЧ');
    // Удаление пользователей с пустыми паролями
    this.userService.deleteEmptyPasswordUsers();
    // Удаление организаций и пользователей с пустыми именами
    this.userService.deleteOrganizationsAndUsers();
    // Удаление устаревших баннеров
    this.adminService.deleteExpiredBanners();
    // Отмена просроченных не принятых заказов
    this.bookingService.cancelExpiredUnacceptedBookings();
    // Завершение просроченных принятых заказов
    this.bookingService.doneExpiredAcceptedBookings();
  }
}
