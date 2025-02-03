import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CatchErrors, Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @CatchErrors()
  async createForUser(createNotificationDto: CreateNotificationDto) {
    const { email, ...of } = createNotificationDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    Utils.checkEntity(user, 'Пользователь не найден');
    const createdAt = new Date();
    console.log(createdAt);
    const newNotification = this.notificationRepository.create({
      ...of,
      createdAt: createdAt,
      users:[user],
    });
    await this.notificationRepository.save(newNotification);
    return JSON.stringify(HttpStatus.CREATED);
  }

  @CatchErrors()
  async createForAll(createNotificationDto: CreateNotificationDto) {
    const { email, title, ...of } = createNotificationDto;
    const createdAt = new Date();
    const newNotification = this.notificationRepository.create({
      ...of,
      createdAt,
      title: "Burabay администратор",
    });
    await this.notificationRepository.save(newNotification);
    return JSON.stringify(HttpStatus.CREATED);
}

  @CatchErrors()
  async findForAllUsers(tokenData: TokenData){
    const notifications = await this.notificationRepository.find({
      relations: ['users'],
    });
  
    return notifications.filter((notification) => !notification.users || notification.users.length === 0);
  }

  @CatchErrors()
  async findForUser(tokenData: TokenData){
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
    });
    Utils.checkEntity(user, 'Пользователь не найден');
    return await this.notificationRepository.find({
      where: { users: user },
      order: { createdAt: 'DESC' },
    });
  }

  @CatchErrors()
  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      const { email, ...oF } = updateNotificationDto;
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
