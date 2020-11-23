import { CreateDateColumn, UpdateDateColumn } from "typeorm";
export default abstract class TrackingDate {
    @CreateDateColumn({ type: "timestamptz", update: false, select: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz", select: false })
    updated_at: Date;
}
