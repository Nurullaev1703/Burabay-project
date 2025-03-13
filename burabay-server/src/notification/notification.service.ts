import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CatchErrors, Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateAllNotificationDto } from './dto/create-all-notifications.dto';
import { FirebaseAdminService } from './firebase-admin.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePushTokenDto } from './dto/create-pushToken.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  //Создание для пользователя
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
    // Отправка push-уведомления
    if (user.pushToken) {
      const payload = {
        data: {
          title: of.title,
          body: of.message,
          icon: 'https://burabay-damu.kz/assets/burabay-logo-By3u97Na.svg',
          click_action: 'https://burabay-damu.kz',
        },
        webpush: {
          headers: {
            urgency: 'high',
          },
          notification: {
            requireInteraction: true, // Уведомление останется на экране
          }
        }
      }
      await this.firebaseAdminService.sendNotification(user.pushToken, payload);
    }

    return JSON.stringify(HttpStatus.CREATED);
  }

  //Создание пуша для пользователя
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

  //Создание для уведов для всех
  @CatchErrors()
  async createForAll(createAllNotificationDto: CreateAllNotificationDto) {
    const { ...of } = createAllNotificationDto;
    const createdAt = new Date();
    const newNotification = this.notificationRepository.create({
      ...of,
      createdAt,
      title: "Burabay администратор",
    });
    await this.notificationRepository.save(newNotification);

    // Отправка push-уведомлений всем пользователям
    const users = await this.userRepository.find();
    for (const user of users) {
      if (user.pushToken) {
        const payload = {
          data: {
            title: 'Burabay администратор',
            body: of.message,
            icon: 'https://burabay-damu.kz/assets/burabay-logo-By3u97Na.svg',
            click_action: 'https://burabay-damu.kz',
          },
          webpush: {
            headers: {
              urgency: 'high',
            },
            notification: {
              requireInteraction: true, // Уведомление останется на экране
            }
          }
        };
        await this.firebaseAdminService.sendNotification(user.pushToken, payload);
      }
    }

    return JSON.stringify(HttpStatus.CREATED);
}

  @CatchErrors()
  async findForAll(tokenData: TokenData){
    const notifications = await this.notificationRepository.find({
      relations: ['users'],
    });
    
    return notifications.filter((notification) => !notification.users || notification.users.length === 0);
  }


  @CatchErrors()
  async findForUser(tokenData: TokenData){
    const user = await this.userRepository.findOne({ where: { id: tokenData.id } });

    const notificationsfilter = await this.notificationRepository.find({
      order: { createdAt: 'DESC' },
      relations: { users: true },
    });

    const filterNotifications = notificationsfilter.filter((notification) =>
      !notification.users ||
      notification.users.length === 0 ||
      notification.users.some(u => u.id === user.id)
    );

    const mapNotifications = filterNotifications.map(notifications => ({
      ...notifications,
      users: notifications.users ? notifications.users.map(user => user.email) : [],
    }));

    return mapNotifications
  }

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

  @CatchErrors()
  async remove(id: string) {
    const notification = await this.notificationRepository.findOne({ where: { id: id } });
    Utils.checkEntity(notification, 'Уведомление не найдено');
    await this.notificationRepository.remove(notification);
    return JSON.stringify(HttpStatus.OK);
  }
}
