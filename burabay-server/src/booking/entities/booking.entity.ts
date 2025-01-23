import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PaymentType } from '../types/payment.type';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Booking extends AbstractEntity<Booking> {
  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @Column()
  name: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  date: string;

  @Column({ nullable: true })
  time: string;

  @Column({ name: 'is_child_rate' })
  isChildRate: boolean;

  @Column({ name: 'payment_type' })
  paymentType: PaymentType;
}
