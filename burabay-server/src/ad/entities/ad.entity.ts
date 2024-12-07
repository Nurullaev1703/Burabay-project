import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Category } from 'src/category/entities/category.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Ad extends AbstractEntity<Ad> {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ type: 'text', array: true })
  images: string[];

  @ManyToOne(() => Organization, (org) => org.ads)
  organization: Organization;

  // TODO Удалить после 29 декабря.
  @ManyToOne(() => Category, (category) => category.ads)
  category: Category;

  // TODO Раскомментить после 29 декабря.
  // @ManyToOne(() => Subcategory, (subcategory) => subcategory.ads)
  // subcategory: Subcategory;
}
