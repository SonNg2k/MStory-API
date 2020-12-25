import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { ulid } from "ulid";
import Permission from "./Permission";
import User from "./User";

@Entity({ name: 'roles' })
export default class Role {
    @PrimaryColumn({ type: 'char', length: 26 })
    role_id: string

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string

    @Column({ type: 'varchar', length: 80 })
    description: string

    @ManyToMany(type => Permission, permission => permission.roles)
    @JoinTable({
        name: 'role_permissions', // name of the brige table
        joinColumn: {
            referencedColumnName: 'role_id',
            name: 'role_id'
        },
        inverseJoinColumn: {
            referencedColumnName: 'permission_id',
            name: 'permission_id'
        }
    })
    permissions: Permission[]

    @OneToMany(type => User, user => user.role_id)
    users: User[]

    @CreateDateColumn({ type: "timestamptz", update: false, select: false })
    created_at: Date;

    @BeforeInsert()
    private beforeInsert() {
        this.role_id = ulid()
    }
}
