import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Ad } from '../../ad/entities/ad.entity';
import { Address } from '../../address/entities/address.entity';

@Entity()
export class Organization extends AbstractEntity<Organization> {
  @Column({ name: 'img_url' })
  imgUrl: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ nullable: true })
  bin: string;

  // Талон регистрации.
  @Column({ nullable: true, name: 'reg_coupon_path' })
  regCouponPath: string;

  // Справка IBAN.
  @Column({ nullable: true, name: 'iban_doc_path' })
  ibanDocPath: string;

  // Устав организации
  @Column({ nullable: true, name: 'org_rule_path' })
  orgRulePath: string;

  // @Column()
  // address: string;

  @OneToOne(() => Address, (address) => address.organization)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  // Средний рейтинг.
  @Column('float', { nullable: true })
  rating: number;

  // Кол-во отзывов.
  @Column({ nullable: true, name: 'rating_count' })
  reviewCount: number;

  @OneToOne(() => User, (user) => user.organization)
  user: User;

  @Column({ name: 'is_confirmed' })
  isConfirmed: boolean;

  @Column({ name: 'is_confirm_waiting', default: false })
  isConfirmWating: boolean;

  @Column({ name: 'is_confirm_canceled', default: false })
  isConfirmCanceled: boolean;

  @Column()
  description: string;

  @Column({ name: 'site_url' })
  siteUrl: string;

  @OneToMany(() => Ad, (ad) => ad.organization)
  ads: Ad[];

  @Column({ name: 'is_banned', default: false })
  isBanned: boolean;
}
