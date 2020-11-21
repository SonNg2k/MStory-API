import { Column, Entity, PrimaryColumn, BeforeInsert, ManyToOne } from "typeorm";
import { ulid } from "ulid";
import TrackingDate from "./TrackingDate";
import User from "./User";

@Entity({ name: 'projects' })
export default class Project extends TrackingDate {
    @PrimaryColumn({ type: "char", length: 26 })
    project_id: string

    @Column({ type: "varchar", length: 80 })
    name: string

    @Column({ type: "varchar", length: 5000, nullable: true })
    description: string

    @Column({ default: true })
    is_public: boolean

    @Column({ default: true })
    is_active: boolean

    @ManyToOne(type => User, user => user.projects_created)
    creator: Promise<User>

    @BeforeInsert()
    private beforeInsert() {
        this.project_id = ulid()
    }
}
