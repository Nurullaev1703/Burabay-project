import { ReviewAnswer } from '../../review-answers/entities/review-answer.entity';
import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Ad } from '../../ad/entities/ad.entity';
import { User } from '../../users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ReviewReport } from '../../review-report/entities/review-report.entity';

@Entity()
export class Review extends AbstractEntity<Review> {
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Ad, (ad) => ad.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @OneToOne(() => ReviewAnswer, (answer) => answer.review, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'answer_id' })
  answer: ReviewAnswer;

  @OneToOne(() => ReviewReport, (report) => report.review, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'report_id' })
  report: ReviewReport;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Column()
  text: string;

  @Column()
  stars: number;

  @Column({ name: 'is_cheked', default: false })
  isCheked: boolean;

  @Column({ default: true, name: 'is_new' })
  isNew: boolean;

  @CreateDateColumn()
  date: Date;
}
