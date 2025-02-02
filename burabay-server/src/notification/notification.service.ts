import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CatchErrors, Utils } from 'src/utilities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @CatchErrors()
  async create(createNotificationDto: CreateNotificationDto) {
    const { userId, ...of } = createNotificationDto;
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    Utils.checkEntity(user, 'Пользователь не найден');
    const createdAt = new Date();
    console.log(createdAt);
    const newNotification = this.notificationRepository.create({
      ...of,
      createdAt: createdAt,
      user: user,
    });
    await this.notificationRepository.save(newNotification);
    return JSON.stringify(HttpStatus.CREATED);
  }

  async findAll(tokenData: TokenData) {
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
    });
    Utils.checkEntity(user, 'Пользователь не найден');
    return await this.notificationRepository.find({
      where: { user: user },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  async remove(id: string) {
    return `This action removes a #${id} notification`;
  }
}
