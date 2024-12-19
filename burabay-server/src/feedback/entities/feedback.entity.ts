import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class Feedback extends AbstractEntity<Feedback> {
  @OneToOne(() => User, (user) => user.feedback)
  user: User;

  // Опишите, что неудобно в приложении?
  @Column({ nullable: true, name: 'uncomfortable_text' })
  uncomfortableText: string;

  // Что может сделать приложение удобнее?
  @Column({ nullable: true, name: 'advice_text' })
  adviceText: string;

  @Column()
  stars: number;
}
