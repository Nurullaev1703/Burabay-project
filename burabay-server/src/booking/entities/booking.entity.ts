import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PaymentType } from '../types/payment.type';
import { User } from '../../users/entities/user.entity';
import { Ad } from 'src/ad/entities/ad.entity';

@Entity()
export class Booking extends AbstractEntity<Booking> {
  @ManyToOne(() => Ad, (ad) => ad.bookings)
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

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

  @Column({ name: 'start_date', nullable: true })
  startDate: string;

  @Column({ name: 'end_date', nullable: true })
  endDate: string;
}
