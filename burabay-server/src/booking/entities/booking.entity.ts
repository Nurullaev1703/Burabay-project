import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BookingStatus, PaymentType } from '../types/booking.types';
import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ad/entities/ad.entity';

@Entity()
export class Booking extends AbstractEntity<Booking> {
  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Ad, (ad) => ad.bookings)
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @Column({ default: BookingStatus.IN_PROCESS })
  status: BookingStatus;

  @Column({ name: 'total_price', nullable: true })
  totalPrice: number;

  @Column()
  name: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  time: string;

  @Column({ name: 'is_child_rate' })
  isChildRate: boolean;

  @Column({ name: 'payment_type' })
  paymentType: PaymentType;

  @Column({ name: 'is_paid', default: false })
  isPaid: boolean;

  @Column({ name: 'date_start', nullable: true })
  dateStart: Date;

  @Column({ name: 'date_end', nullable: true })
  dateEnd: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
