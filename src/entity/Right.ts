import { BeforeInsert, Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { ulid } from "ulid";
import Role from "./Role";

@Entity({ name: 'rights' })
export default class Right {
    @PrimaryColumn({ type: 'char', length: 26 })
    right_id: string

    @Column({ type: 'varchar', length: 80, unique: true })
    name: string

    @Column({ type: 'varchar', length: 80, unique: true })
    code: string

    @Column({ type: 'varchar', length: 80 })
    description: string

    @Column({ type: 'varchar', length: 6 })
    http_method: string

    @Column({ type: 'varchar', length: 60 })
    url_path: string

    @ManyToMany(type => Role, role => role.rights)
    roles: Role[]

    @BeforeInsert()
    private beforeInsert() {
        this.right_id = ulid()
    }
}
