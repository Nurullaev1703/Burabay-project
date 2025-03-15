import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Banner extends AbstractEntity<Banner> {
  @Column({ name: 'image_path' })
  imagePath: string;

  @Column()
  text: string;

  @Column({ name: 'delete_date' })
  deleteDate: Date;
}
