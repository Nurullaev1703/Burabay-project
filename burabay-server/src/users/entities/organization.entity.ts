import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Column, Entity, JoinColumn, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class Organization extends AbstractEntity<Organization> {
  @Column({ name: 'img_url' })
  imgUrl: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ name: 'identity_number' })
  identityNumber: string;

  // Средний рейтинг.
  @Column('float', { nullable: true })
  rating: number;

  // Кол-во отзывов.
  @Column({ nullable: true, name: 'rating_count' })
  reviewCount: number;
}
