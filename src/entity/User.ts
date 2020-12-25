import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { ulid } from 'ulid';
import bcrypt from 'bcrypt'
import Project from "./Project";
import ProjectMember from "./ProjectMember";
import Story from "./Story";
import StoryOwner from "./StoryOwner";
import TrackingDate from "./TrackingDate";
import Role from "./Role";

@Entity({ name: "users" })
export default class User extends TrackingDate {
    @PrimaryColumn({ type: "char", length: 26 })
    user_id: string;

    @Column({ type: "varchar", length: 64, unique: true })
    email: string;

    @Column({ type: "varchar", length: 50 })
    fullname: string;

    @Column({ type: "varchar", length: 39, unique: true })
    username: string;

    @Column({ type: "varchar", length: 1024, nullable: true, select: false })
    password: string;

    @Column({ type: 'timestamptz', nullable: true })
    last_login: Date

    // One user creates 0-n projects
    @OneToMany(type => Project, project => project.creator)
    projects_created: Project[]

    // One user creates 0-n stories
    @OneToMany(type => Story, story => story.creator)
    stories_created: Story[]

    // A user can be a member of 0-n projects
    @OneToMany(type => ProjectMember, projectMember => projectMember.member)
    projects_invited: ProjectMember[]

    // A user can be an owner of 0-n stories
    @OneToMany(type => StoryOwner, storyOwner => storyOwner.owner)
    stories_owned: StoryOwner[]

    @ManyToOne(type => Role, role => role.users, { onDelete: 'SET NULL' })
    @JoinColumn({ name: "role_id" })
    role_id: Role

    @BeforeInsert()
    private async beforeInsert() {
        this.user_id = ulid()
        this.email = this.email.toLowerCase()
        this.username = this.username.toLowerCase()
        this.password = await bcrypt.hash(this.password, 10)
    }

    @BeforeUpdate()
    private async beforeUpdate() {
        this.email = this.email.toLowerCase()
        this.username = this.username.toLowerCase()
        this.password = await bcrypt.hash(this.password, 10)
    }
}
