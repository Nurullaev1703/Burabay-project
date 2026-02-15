import { User } from 'src/users/entities/user.entity';
import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Subcategory } from '../../subcategory/entities/subcategory.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'img_path' })
  imgPath: string;

  @Column({ type: 'text', array: true })
  details: string[];

  // @OneToMany(() => Ad, (ad) => ad.category)
  // ads: Ad[];

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];

  // Пользователи, которые добавили категорию в избранное.
  @ManyToMany(() => User, (user) => user.categoriesFavorited)
  usersFavorited: User[];
}
