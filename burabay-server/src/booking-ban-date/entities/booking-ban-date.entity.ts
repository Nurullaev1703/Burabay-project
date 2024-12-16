import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class BookingBanDate extends AbstractEntity<BookingBanDate> {
  @ManyToOne(() => Ad, (ad) => ad.bookingBanDate)
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @Column()
  date: string;

  @Column({ name: 'all_day' })
  allDay: boolean;

  @Column({ type: 'text', array: true, nullable: true })
  times: string[];
}
