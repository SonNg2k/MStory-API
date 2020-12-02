import { Column, Entity, PrimaryColumn, BeforeInsert, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { ulid } from "ulid";
import ProjectMember from "./ProjectMember";
import Story from "./Story";
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

    // One user creates 0-n projects
    @ManyToOne(type => User, user => user.projects_created)
    // The user responsible for a project must not be deleted
    @JoinColumn({ name: "creator_id" })
    creator: User

    // A project has 0-n stories
    @OneToMany(type => Story, story => story.project)
    stories: Story[]

    // A project has 0-n members (users)
    @OneToMany(type => ProjectMember, projectMember => projectMember.project)
    members: ProjectMember[]

    @BeforeInsert()
    private beforeInsert() {
        this.project_id = ulid()
    }
}
