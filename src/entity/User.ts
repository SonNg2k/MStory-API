import { ulid } from 'ulid'
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export default class User {
    @PrimaryColumn({ type: "char", length: 26 })
    user_id: string;

    @BeforeInsert()
    private beforeInsert() {
        this.user_id = ulid()
    }

    @Column({ type: "varchar", length: 64 })
    email: string;

    @Column({ type: "varchar", length: 50 })
    fullname: string;

    @Column({ type: "varchar", length: 39 })
    username: string;

    @Column({ type: "varchar", length: 1024, nullable: true, select: false })
    password: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @Column({type: 'timestamp', nullable: true})
    last_login: Date
}
