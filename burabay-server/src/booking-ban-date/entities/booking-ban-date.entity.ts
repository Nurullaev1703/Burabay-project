import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Ad } from '../../ad/entities/ad.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class BookingBanDate extends AbstractEntity<BookingBanDate> {
  @ManyToOne(() => Ad, (ad) => ad.bookingBanDate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @Column()
  date: string;

  @Column({ name: 'all_day' })
  allDay: boolean;

  @Column({ type: 'text', array: true, nullable: true })
  times: string[];

  @Column({ name: 'is_by_booking', default: false })
  isByBooking: boolean;
}
