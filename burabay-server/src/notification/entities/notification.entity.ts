import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { NotificationType } from '../types/notification.type';

@Entity()
export class Notification extends AbstractEntity<Notification> {
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  message: string;

  @Column()
  type: NotificationType;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;
}
