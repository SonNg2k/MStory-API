import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import Project from "./Project";
import User from "./User";

@Entity('project_members')
export default class ProjectMember {
    @ManyToOne(type => Project, project => project.members, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: "project_id" })
    project: Project

    @ManyToOne(type => User, user => user.projects_invited, { primary: true })
    @JoinColumn({ name: "user_id" })
    member: User

    @CreateDateColumn({ type: "timestamptz", update: false, select: false })
    created_at: Date;

    @Column({ type: 'varchar', length: 10 })
    role: string
}
