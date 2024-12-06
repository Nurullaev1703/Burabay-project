import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { ROLE_TYPE } from '../types/user-types';
import { Organization } from './organization.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  role: ROLE_TYPE;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Organization, (organization) => organization.user, { cascade: true, nullable:true })
  @JoinColumn()
  organization: Organization;
}
