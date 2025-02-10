import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Subcategory } from '../../subcategory/entities/subcategory.entity';
import { Organization } from '../../users/entities/organization.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AdDetailsType } from '../types/ad.details.type';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { Break } from '../../breaks/entities/break.entity';
import { Address } from '../../address/entities/address.entity';
import { BookingBanDate } from '../../booking-ban-date/entities/booking-ban-date.entity';
import { User } from '../../users/entities/user.entity';
import { Review } from '../../review/entities/review.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity()
export class Ad extends AbstractEntity<Ad> {
  @ManyToOne(() => Organization, (org) => org.ads)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.ads)
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Subcategory;

  @OneToMany(() => Booking, (booking) => booking.ad)
  bookings: Booking[];

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'text', array: true })
  images: string[];

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  // Подробности объявления
  @Column({ type: 'jsonb' })
  details: AdDetailsType;

  @Column({ name: 'youtube_link', nullable: true })
  youtubeLink: string;

  @ManyToOne(() => Address, (address) => address.ad)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToMany(() => BookingBanDate, (bbd) => bbd.ad)
  bookingBanDate: BookingBanDate[];

  @ManyToMany(() => User, (user) => user.favorites)
  usersFavorited: User[];

  // Круглосуточно ли объявление.
  @Column({ name: 'is_round_the_clock', nullable: true })
  isRoundTheClock: boolean;

  @OneToOne(() => Schedule, (schedule) => schedule.ad)
  schedule: Schedule;

  @OneToMany(() => Break, (breaks) => breaks.ad)
  breaks: Break[];

  @Column({ nullable: true })
  isFullDay: boolean;

  // Времена начала услуги. Массив со строками времени типа: ['10:00', '12:00']
  @Column({ type: 'text', array: true, nullable: true, name: 'start_time' })
  startTime: string[];

  // Имеется ли длительность у услуги.
  @Column({ type: 'boolean', name: 'is_duration', nullable: true })
  isDuration: boolean;

  // Длительность услуги.
  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true, name: 'unlimited_clients' })
  unlimitedClients: boolean;

  @Column({ nullable: true, name: 'adults_number' })
  adultsNumber: number;

  @Column({ nullable: true, name: 'kids_number' })
  kidsNumber: number;

  @Column({ nullable: true, name: 'kids_min_age' })
  kidsMinAge: number;

  @Column({ nullable: true, name: 'pets_allowed' })
  petsAllowed: boolean;

  @Column({ nullable: true, name: 'is_bookable' })
  isBookable: boolean;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true, name: 'price_for_child' })
  priceForChild: number;

  @Column({ nullable: true, name: 'on_site_payment' })
  onSitePayment: boolean;

  @Column({ nullable: true, name: 'online_payment' })
  onlinePayment: boolean;

  @Column({ name: 'is_blocked', type: 'boolean', default: false })
  isBlocked: boolean;

  // Объявление полностью готово?
  @Column({ name: 'is_complete', type: 'boolean', default: false })
  isComplete: boolean;

  // Дата создания объявления.
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: 0 })
  views: number;

  @OneToMany(() => Review, (review) => review.ad)
  reviews: Review[];

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ type: 'numeric', name: 'avg_rating', default: 0, precision: 2, scale: 1 })
  avgRating: number;
}
