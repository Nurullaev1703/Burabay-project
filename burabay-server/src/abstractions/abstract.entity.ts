import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/* Абстрактная сущность от которой наследуются другие сущности. Создает поле id, даты создания, обновления и констурктор. */
export class AbstractEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(item: Partial<T>) {
    Object.assign(this, item);
  }
}
