import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { Category } from 'src/category/entities/category.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Subcategory extends AbstractEntity<Subcategory> {
  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Ad, (ad) => ad.subcategory)
  ads: Ad[];
}
