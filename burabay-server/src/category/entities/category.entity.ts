import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @OneToMany(() => Ad, (ad) => ad.category)
  ads: Ad[];

  // TODO Раскомментить после 29 декабря.
  // @ManyToOne(() => Subcategory, (subcategory) => subcategory.category)
  // subcategories: Subcategory[];
}
