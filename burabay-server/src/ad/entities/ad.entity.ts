import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Category } from 'src/category/entities/category.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';

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

  @Column({ name: 'is_blocked', type: 'boolean', default: false })
  isBlocked: boolean;

  @ManyToOne(() => Organization, (org) => org.ads)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  // TODO Удалить после 29 декабря.
  @ManyToOne(() => Category, (category) => category.ads)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // TODO Раскомментить после 29 декабря.
  // @ManyToOne(() => Subcategory, (subcategory) => subcategory.ads)
  // subcategory: Subcategory;

  // Дата создания объявления.
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
