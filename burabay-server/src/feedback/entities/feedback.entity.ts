import { AbstractEntity } from '../../abstractions/abstract.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class Feedback extends AbstractEntity<Feedback> {
  @OneToOne(() => User, (user) => user.feedback, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true })
  text: string;

  @Column()
  stars: number;
}
