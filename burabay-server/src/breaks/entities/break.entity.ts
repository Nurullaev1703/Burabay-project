import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Break extends AbstractEntity<Break> {
  @ManyToOne(() => Ad, (ad) => ad.breaks)
  @JoinColumn()
  ad: Ad;

  @Column()
  start: string;

  @Column()
  end: string;
}
