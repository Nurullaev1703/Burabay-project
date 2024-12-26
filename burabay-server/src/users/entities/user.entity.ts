import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { ROLE_TYPE } from '../types/user-types';
import { Organization } from './organization.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Review } from 'src/review/entities/review.entity';

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

  @ManyToMany(() => Ad, (ad) => ad.usersFavorited)
  @JoinTable() // Обязательно для владельца связи
  favorites: Ad[];

  @OneToOne(() => Organization, (organization) => organization.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToOne(() => Feedback, (feedback) => feedback.user)
  @JoinColumn({ name: 'feedback_id' })
  feedback: Feedback;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @Column({ name: 'is_banned', default: false })
  isBanned: boolean;
}
