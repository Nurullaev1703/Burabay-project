import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Organization } from 'src/users/entities/organization.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AdDetailsType } from '../types/ad.details.type';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Break } from 'src/breaks/entities/break.entity';

@Entity()
export class Ad extends AbstractEntity<Ad> {
  @ManyToOne(() => Organization, (org) => org.ads)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.ads)
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Subcategory;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ type: 'text', array: true })
  images: string[];

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  // Подробности объявления
  @Column({ type: 'json' })
  details: AdDetailsType;

  @Column({ name: 'youtube_link', nullable: true })
  youtubeLink: string;

  // Массив с двумя координатами с карты.
  @Column({ type: 'float', array: true, nullable: true })
  coordinates: number[];

  @Column({ nullable: true })
  address: string;

  // Круглосуточно ли объявление.
  @Column({ name: 'is_round_the_clock', nullable: true })
  isRoundTheClock: boolean;

  @OneToOne(() => Schedule, (schedule) => schedule.ad)
  schedule: Schedule;

  // Имеется ли длительность у услуги.
  @Column({ type: 'boolean', name: 'is_duration', nullable: true })
  isDuration: boolean;

  // Длительность услуги.
  @Column({ nullable: true })
  duration: string;

  // Времена начала услуги. Массив со строками времени типа: ['10:00', '12:00']
  @Column({ type: 'text', array: true, nullable: true })
  startTime: string[];

  @Column({ name: 'is_blocked', type: 'boolean', default: false })
  isBlocked: boolean;

  // Объявление полностью готово?
  @Column({ name: 'is_complete', type: 'boolean', default: false })
  isComplete: boolean;

  // Дата создания объявления.
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Break, (breaks) => breaks.ad)
  breaks: Break[];
}
