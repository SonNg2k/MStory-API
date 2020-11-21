import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export default abstract class TrackingDate {
    @CreateDateColumn({ type: "timestamp", update: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;
}
