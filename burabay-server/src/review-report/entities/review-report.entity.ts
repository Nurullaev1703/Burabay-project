import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Review } from '../../review/entities/review.entity';
import { Organization } from '../../users/entities/organization.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class ReviewReport extends AbstractEntity<ReviewReport> {
  @OneToOne(() => Review, (review) => review.report, { onDelete: 'CASCADE' })
  review: Review;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  org: Organization;

  @Column()
  text: string;

  @Column()
  date: Date;
}
