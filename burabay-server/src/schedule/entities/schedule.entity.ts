import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { BreakType } from '../types/break.type';

@Entity()
export class Schedule extends AbstractEntity<Schedule> {
  @OneToOne(() => Ad, (ad) => ad.schedule)
  ad: Ad;

  @Column({ nullable: true, name: 'mon_start' })
  monStart: string;

  @Column({ nullable: true, name: 'mon_end' })
  monEnd: string;

  @Column({ nullable: true, name: 'tue_start' })
  tueStart: string;

  @Column({ nullable: true, name: 'tue_end' })
  tueEnd: string;

  @Column({ nullable: true, name: 'wen_start' })
  wenStart: string;

  @Column({ nullable: true, name: 'wen_end' })
  wenEnd: string;

  @Column({ nullable: true, name: 'thu_start' })
  thuStart: string;

  @Column({ nullable: true, name: 'thu_end' })
  thuEnd: string;

  @Column({ nullable: true, name: 'fri_start' })
  friStart: string;

  @Column({ nullable: true, name: 'fri_end' })
  friEnd: string;

  @Column({ nullable: true, name: 'sat_start' })
  satStart: string;

  @Column({ nullable: true, name: 'sat_end' })
  satEnd: string;

  @Column({ nullable: true, name: 'sun_start' })
  sunStart: string;

  @Column({ nullable: true, name: 'sun_end' })
  sunEnd: string;

  @Column({ type: 'jsonb', nullable: true })
  break: BreakType[];
}