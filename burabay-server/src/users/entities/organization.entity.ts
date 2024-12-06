import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Organization extends AbstractEntity<Organization> {
  @Column({ name: 'img_url' })
  imgUrl: string;

  @Column({ name: 'name' })
  name: string;

  @Column()
  address: string;

  // Средний рейтинг.
  @Column('float', { nullable: true })
  rating: number;

  // Кол-во отзывов.
  @Column({ nullable: true, name: 'rating_count' })
  reviewCount: number;

  @OneToOne(() => User, (user) => user.organization)
  user: User;
}
