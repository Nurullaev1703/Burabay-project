import { HttpStatus, Injectable, Inject } from '@nestjs/common';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CatchErrors, Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateAllNotificationDto, CreateCategoryNotificationDto } from './dto/create-all-notifications.dto';
import { FirebaseAdminService } from './firebase-admin.service';
import { EmailService } from 'src/authentication/email.service';
import { CreatePushTokenDto } from './dto/create-pushToken.dto';
import { ROLE_TYPE } from 'src/users/types/user-types';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly emailService: EmailService,
  ) {}

  /** Создание уведомления для пользователя */
  @CatchErrors()
  async createForUser(createNotificationDto: CreateNotificationDto) {
    const { email, ...of } = createNotificationDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    Utils.checkEntity(user, 'Пользователь не найден');
    const createdAt = new Date();
    const newNotification = this.notificationRepository.create({
      ...of,
      createdAt: createdAt,
      users: [user],
    });
    await this.notificationRepository.save(newNotification);
    
    // Отправка push и email уведомлений в фоне (не ждём завершения)
    this.#sendNotificationsInBackground(user, of.title, of.message).catch(err => {
      console.error('Error sending notifications:', err);
    });

    return JSON.stringify(HttpStatus.CREATED);
  }

  /** Вспомогательный метод для отправки уведомлений в фоне */
  async #sendNotificationsInBackground(user: User, title: string, message: string) {
    const promises: Promise<any>[] = [];
    
    if (user.pushToken) {
      const payload = {
        data: {
          title: title,
          body: message,
          icon: 'https://burabay-damu.kz/assets/burabay-logo-By3u97Na.svg',
          click_action: 'https://burabay-damu.kz',
        },
        webpush: {
          headers: {
            urgency: 'high',
          },
          notification: {
            requireInteraction: true,
          },
        },
      };
      promises.push(this.firebaseAdminService.sendNotification(user.pushToken, payload));
    }
    
    if (user.email) {
      promises.push(this.emailService.sendNotificationMessage(user.email, message, title));
    }
    
    await Promise.all(promises);
  }

  /** Создание пуш-токена для пользователя */
  @CatchErrors()
  async createPushToken(createPushTokenDto: CreatePushTokenDto, tokenData: TokenData) {
    const { pushToken } = createPushTokenDto;
    const user = await this.userRepository.findOne({ where: { id: tokenData.id } });
    Utils.checkEntity(user, 'Пользователь не найден');

    if (user) {
      user.pushToken = pushToken;
      await this.userRepository.save(user);
    }

    return JSON.stringify(HttpStatus.CREATED);
  }

  /** Проверка наличия непрочитанных уведомлений у пользователя */
  @CatchErrors()
  async checkNotifications(tokenData: TokenData) {
    const notifications = await this.notificationRepository.count({
      where: { users: { id: tokenData.id }, isRead: false },
    });
    if (notifications > 0) return true;
    else return false;
  }

  /** Создание уведомления для всех пользователей */
  @CatchErrors()
  async createForAll(createAllNotificationDto: CreateAllNotificationDto) {
    const { ...of } = createAllNotificationDto;
    const createdAt = new Date();

    const users = await this.userRepository.find();
    
    // Создаём все уведомления одним bulk запросом
    const notifications = users.map(user => 
      this.notificationRepository.create({
        ...of,
        createdAt,
        title: 'Burabay администратор',
        users: [user],
      })
    );
    await this.notificationRepository.save(notifications);
    
    // Отправка push и email в фоне
    this.#sendBulkNotifications(users, 'Burabay администратор', of.message).catch(err => {
      console.error('Error sending bulk notifications:', err);
    });

    return JSON.stringify(HttpStatus.CREATED);
  }

  /** Получение всех уведомлений, созданных для всех пользователей */
  @CatchErrors()
  async findForAll() {
    // Находим уведомления с заголовком "Burabay администратор" (массовые рассылки)
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.users', 'users')
      .where('notification.title = :title', { title: 'Burabay администратор' })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();

    // Группируем по уникальному сообщению и дате для избежания дубликатов
    const uniqueNotifications = new Map();
    
    for (const notification of notifications) {
      const key = `${notification.message}_${notification.createdAt.getTime()}`;
      if (!uniqueNotifications.has(key)) {
        uniqueNotifications.set(key, notification);
      }
    }

    return Array.from(uniqueNotifications.values());
  }

  /** Получение всех уведомлений, созданных для пользователя */
  @CatchErrors()
  async findForUser(tokenData: TokenData) {
    const user = await this.userRepository.findOne({ where: { id: tokenData.id } });

    const notificationsfilter = await this.notificationRepository.find({
      order: { createdAt: 'DESC' },
      relations: { users: true },
    });

    const filterNotifications = notificationsfilter.filter(
      (notification) =>
        !notification.users || notification.users.length === 0 || notification.users.some((u) => u.id === user.id),
    );

    const mapNotifications = filterNotifications.map((notifications) => ({
      ...notifications,
      users: notifications.users ? notifications.users.map((user) => user.email) : [],
    }));

    return mapNotifications;
  }

  /** Обновление уведомления */
  @CatchErrors()
  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      const { ...oF } = updateNotificationDto;
      const notification = await this.notificationRepository.findOne({ where: { id: id } });
      Utils.checkEntity(notification, 'Уведомление не найдено');
      Object.assign(notification, oF);
      await this.notificationRepository.save(notification);
      return JSON.stringify(HttpStatus.OK);
    } catch (error) {
      Utils.errorHandler(error);
    }
  }

  /** Пометить все уведомления пользователя как прочитанные */
  @CatchErrors()
  async markAllAsRead(tokenData: TokenData) {
    const notifications = await this.notificationRepository.find({
      where: { users: { id: tokenData.id }, isRead: false },
    });
    
    // Обновляем все уведомления одним запросом
    notifications.forEach(notification => {
      notification.isRead = true;
    });
    
    if (notifications.length > 0) {
      await this.notificationRepository.save(notifications);
    }
  }

  /** Удаление уведомления */
  @CatchErrors()
  async remove(id: string) {
    const notification = await this.notificationRepository.findOne({ where: { id: id } });
    Utils.checkEntity(notification, 'Уведомление не найдено');
    await this.notificationRepository.remove(notification);
    return JSON.stringify(HttpStatus.OK);
  }

  /** Создание уведомления для всех туристов. */
  @CatchErrors()
  async createForTourists(createAllNotificationDto: CreateAllNotificationDto) {
    const { ...of } = createAllNotificationDto;
    const createdAt = new Date();

    const tourists = await this.userRepository.find({
      where: { role: ROLE_TYPE.TOURIST },
    });

    // Создаём все уведомления одним bulk запросом
    const notifications = tourists.map(tourist => 
      this.notificationRepository.create({
        ...of,
        createdAt,
        title: 'Burabay администратор',
        users: [tourist],
      })
    );
    await this.notificationRepository.save(notifications);
    
    // Отправка push и email в фоне
    this.#sendBulkNotifications(tourists, 'Burabay администратор', of.message).catch(err => {
      console.error('Error sending tourist notifications:', err);
    });

    return JSON.stringify(HttpStatus.CREATED);
  }

  /** Создать уведомления для всех организаций. */
  @CatchErrors()
  async createForOrganizations(createAllNotificationDto: CreateAllNotificationDto) {
    const { ...of } = createAllNotificationDto;
    const createdAt = new Date();

    const organizations = await this.userRepository.find({
      where: { role: ROLE_TYPE.BUSINESS },
    });

    // Создаём все уведомления одним bulk запросом
    const notifications = organizations.map(organization => 
      this.notificationRepository.create({
        ...of,
        createdAt,
        title: 'Burabay администратор',
        users: [organization],
      })
    );
    await this.notificationRepository.save(notifications);
    
    // Отправка push и email в фоне
    this.#sendBulkNotifications(organizations, 'Burabay администратор', of.message).catch(err => {
      console.error('Error sending organization notifications:', err);
    });

    return JSON.stringify(HttpStatus.CREATED);
  }

  /** Создать уведомления для всех туристов с указанными категориями в избранном. */
  @CatchErrors()
  async createForCategory(dto: CreateCategoryNotificationDto) {
    const { categoryIds, ...of } = dto;
    const createdAt = new Date();

    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.categoriesFavorited', 'category', 'category.id IN (:...categoryIds)', {
        categoryIds,
      })
      .where('user.role = :role', { role: ROLE_TYPE.TOURIST })
      .getMany();

    // Убираем дубликаты пользователей
    const uniqueUsers = Array.from(
      new Map(users.map(user => [user.id, user])).values()
    );

    // Создаём все уведомления одним bulk запросом
    const notifications = uniqueUsers.map(user => 
      this.notificationRepository.create({
        ...of,
        title: 'Burabay администратор',
        createdAt: createdAt,
        users: [user],
      })
    );
    await this.notificationRepository.save(notifications);
    
    // Отправка push и email в фоне
    this.#sendBulkNotifications(uniqueUsers, 'Burabay администратор', of.message).catch(err => {
      console.error('Error sending category notifications:', err);
    });

    return JSON.stringify(HttpStatus.CREATED);
  }

  /** Вспомогательный метод для массовой отправки уведомлений в фоне */
  async #sendBulkNotifications(users: User[], title: string, message: string) {
    const promises: Promise<any>[] = [];
    
    for (const user of users) {
      if (user.pushToken) {
        const payload = {
          data: {
            title: title,
            body: message,
            icon: 'https://burabay-damu.kz/assets/burabay-logo-By3u97Na.svg',
            click_action: 'https://burabay-damu.kz',
          },
          webpush: {
            headers: {
              urgency: 'high',
            },
            notification: {
              requireInteraction: true,
            },
          },
        };
        promises.push(
          this.firebaseAdminService.sendNotification(user.pushToken, payload).catch(err => {
            console.error(`Failed to send push to ${user.email}:`, err);
          })
        );
      }
      
      if (user.email) {
        promises.push(
          this.emailService.sendNotificationMessage(user.email, message, title).catch(err => {
            console.error(`Failed to send email to ${user.email}:`, err);
          })
        );
      }
    }
    
    await Promise.all(promises);
  }
}
