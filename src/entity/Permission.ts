import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import Role from "./Role";

@Entity({ name: 'permissions' })
export default class Permission {
    @PrimaryColumn({ type: 'varchar', length: 26 })
    permission_id: string

    @Column({ type: 'varchar', length: 80, unique: true })
    name: string

    @Column({ type: 'varchar', length: 80 })
    description: string

    @Column({ type: 'varchar', length: 6 })
    http_method: string

    @Column({ type: 'varchar', length: 60 })
    url_path: string

    @ManyToMany(type => Role, role => role.permissions)
    roles: Role[]
}
