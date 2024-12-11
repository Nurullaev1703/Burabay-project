import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'img_path' })
  imgPath: string;

  // @OneToMany(() => Ad, (ad) => ad.category)
  // ads: Ad[];

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];
}
