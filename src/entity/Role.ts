import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { ulid } from "ulid";
import Right from "./Right";
import User from "./User";

@Entity({ name: 'roles' })
export default class Role {
    @PrimaryColumn({ type: 'char', length: 26 })
    role_id: string

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string

    @Column({ type: 'varchar', length: 80 })
    description: string

    @ManyToMany(type => Right, right => right.roles)
    @JoinTable({
        name: 'role_rights', // name of the brige table
        joinColumn: {
            referencedColumnName: 'role_id',
            name: 'role_id'
        },
        inverseJoinColumn: {
            referencedColumnName: 'right_id',
            name: 'right_id'
        }
    })
    rights: Right[]

    @OneToMany(type => User, user => user.role_id)
    users: User[]

    @CreateDateColumn({ type: "timestamptz", update: false, select: false })
    created_at: Date;

    @BeforeInsert()
    private beforeInsert() {
        this.role_id = ulid()
    }
}
