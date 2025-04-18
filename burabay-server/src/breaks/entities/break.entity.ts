import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Ad } from '../../ad/entities/ad.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Break extends AbstractEntity<Break> {
  @ManyToOne(() => Ad, (ad) => ad.breaks, { onDelete: 'CASCADE' })
  @JoinColumn()
  ad: Ad;

  @Column()
  start: string;

  @Column()
  end: string;
}
