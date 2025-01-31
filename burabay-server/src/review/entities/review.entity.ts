import { ReviewAnswer } from 'src/review-answers/entities/review-answer.entity';
import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Ad } from '../../ad/entities/ad.entity';
import { User } from '../../users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Review extends AbstractEntity<Review> {
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Ad, (ad) => ad.reviews)
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @OneToOne(() => ReviewAnswer, (answer) => answer.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'answer_id' })
  answer: ReviewAnswer;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Column()
  text: string;

  @Column()
  stars: number;

  @CreateDateColumn()
  date: Date;
}
