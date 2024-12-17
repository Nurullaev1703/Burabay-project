import { AbstractEntity } from 'src/abstractions/abstract.entity';
import { Ad } from 'src/ad/entities/ad.entity';
import { Organization } from 'src/users/entities/organization.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Address extends AbstractEntity<Address> {
  @OneToOne(() => Organization, (organization) => organization.address)
  organization: Organization;

  @OneToMany(() => Ad, (ad) => ad.address)
  ad: Ad[];

  @Column()
  address: string;

  @Column({ name: 'is_main' })
  isMain: boolean;

  @Column({ nullable: true, name: 'special_name' })
  specialName: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;
}