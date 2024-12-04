import { AbstractEntity } from "src/abstractions/abstract.entity";
import { Column, Entity, JoinTable, OneToMany } from "typeorm";

@Entity()
export class Address extends AbstractEntity<Address> {
    @Column()
    region:string

    @Column()
    city:string

    @Column({nullable:true})
    street: string
}
