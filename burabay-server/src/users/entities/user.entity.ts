import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../abstractions/abstract.entity';
import { ROLE_TYPE } from '../types/user-types';
import { Organization } from './organization.entity';
import { Ad } from '../../ad/entities/ad.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Review } from '../../review/entities/review.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Notification } from '../../notification/entities/notification.entity';
@Entity()
export class User extends AbstractEntity<User> {
  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  role: ROLE_TYPE;

  @Column({ nullable: true })
  picture: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  isEmailConfirmed: boolean;

  @ManyToMany(() => Ad, (ad) => ad.usersFavorited, { onDelete: 'CASCADE' })
  @JoinTable()
  favorites: Ad[];

  @OneToOne(() => Organization, (organization) => organization.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToOne(() => Feedback, (feedback) => feedback.user)
  @JoinColumn({ name: 'feedback_id' })
  feedback: Feedback;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @Column({ name: 'is_banned', default: false })
  isBanned: boolean;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @ManyToMany(() => Notification, (notification) => notification.users, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'user_notifications' })
  notifications: Notification[];

  @Column({ nullable: true })
  pushToken: string;
}
