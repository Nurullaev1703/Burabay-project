import { PrimaryGeneratedColumn } from 'typeorm';

/* Абстрактная сущность от которой наследуются другие сущности. Создает поле id и констурктор. */
export class AbstractEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  constructor(item: Partial<T>) {
    Object.assign(this, item);
  }
}
