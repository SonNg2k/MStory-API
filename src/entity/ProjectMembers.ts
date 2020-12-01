import { CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import Project from "./Project";
import User from "./User";

@Entity('project_members')
export default class ProjectMembers {
    @ManyToOne(type => Project, project => project.members, { primary: true })
    @JoinColumn({ name: "project_id" })
    project: Project

    @ManyToOne(type => User, user => user.projects_invited, { primary: true })
    @JoinColumn({ name: "user_id" })
    member: User

    @CreateDateColumn({ type: "timestamptz", update: false, select: false })
    created_at: Date;
}
