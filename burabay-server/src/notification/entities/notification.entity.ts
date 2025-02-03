import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { NotificationType } from '../types/notification.type';

@Entity()
export class Notification extends AbstractEntity<Notification> {
  @ManyToMany(() => User, (user) => user.notifications)
  @JoinTable({ name: 'user_notifications' })
  users: User[];

  @Column({ nullable: true })
  title?: string;

  @Column()
  message: string;

  @Column()
  type: NotificationType;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;
}
