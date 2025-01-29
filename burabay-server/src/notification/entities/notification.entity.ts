import { AbstractEntity } from "src/abstractions/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Notification extends AbstractEntity<Notification>{
    @ManyToOne(()=> User, user => user.notifications)
    @JoinColumn({name: "user_id"})
    user: User;

    @Column()
    message: string;

    @CreateDateColumn({name:"created_at"})
    createdAt: Date;

    @Column({default: false, name:"is_read"})
    isRead: boolean;
}
