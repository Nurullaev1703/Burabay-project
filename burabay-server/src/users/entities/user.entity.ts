import { Column, Entity, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { POSITION_TYPE, ROLE_TYPE, PERMISSIONS_TYPE } from '../types/user-types';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  role: ROLE_TYPE;

  @Column()
  position: POSITION_TYPE;

  @Column()
  email: string;
  
  @Column({nullable:true})
  iin: string;
  
  @Column("json")
  permissions: PERMISSIONS_TYPE;
}
