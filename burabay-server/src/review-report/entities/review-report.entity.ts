import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Review } from 'src/review/entities/review.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class ReviewReport extends AbstractEntity<ReviewReport>{
  @OneToOne(() => Review, (review) => review.report)
  review: Review;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'user_id' })
  org: Organization;

  @Column()
  text: string;

  @Column()
  date: Date;
}
