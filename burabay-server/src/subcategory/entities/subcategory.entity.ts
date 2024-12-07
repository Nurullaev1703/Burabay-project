import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Subcategory extends AbstractEntity<Subcategory> {
  @Column()
  name: string;

  // TODO Раскомментить после 29 декабря.
  // @ManyToOne(() => Category, (category) => category.subcategories)
  // category: Category;

  // TODO Раскомментить после 29 декабря.
  // @OneToMany(() => Ad, (ad) => ad.subcategory)
  // ads: Ad[];
}
