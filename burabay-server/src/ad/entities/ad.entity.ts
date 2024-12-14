import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AdDetailsType } from '../types/ad.details.type';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Entity()
export class Ad extends AbstractEntity<Ad> {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ type: 'text', array: true })
  images: string[];

  @Column({ name: 'youtube_link' })
  youtubeLink: string;

  @Column({ type: 'float', array: true, nullable: true })
  coordinates: number[];

  @Column({ nullable: true })
  address: string;

  @OneToOne(() => Schedule, (schedule) => schedule.ad)
  @JoinColumn()
  schedule: Schedule;

  @Column({ type: 'json' })
  details: AdDetailsType;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'is_blocked', type: 'boolean', default: false })
  isBlocked: boolean;

  @ManyToOne(() => Organization, (org) => org.ads)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.ads)
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Subcategory;

  // Дата создания объявления.
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
