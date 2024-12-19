import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Review extends AbstractEntity<Review> {
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Ad, (ad) => ad.reviews)
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Column()
  text: string;

  @Column()
  stars: number;
}
