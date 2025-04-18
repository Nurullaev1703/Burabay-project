import { AbstractEntity } from '../../abstractions/abstract.entity';
import { Ad } from '../../ad/entities/ad.entity';
import { Organization } from '../../users/entities/organization.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Address extends AbstractEntity<Address> {
  @OneToOne(() => Organization, (organization) => organization.address, { onDelete: 'CASCADE' })
  organization: Organization;

  @OneToMany(() => Ad, (ad) => ad.address, { onDelete: 'CASCADE' })
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
