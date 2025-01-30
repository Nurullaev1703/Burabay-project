import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Review } from 'src/review/entities/review.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class ReviewAnswer extends AbstractEntity<ReviewAnswer> {
  @ManyToOne(() => Review)
  @JoinColumn({ name: 'review_id' })
  review: Review;
}
