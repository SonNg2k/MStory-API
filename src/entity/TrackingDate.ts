import { CreateDateColumn, UpdateDateColumn } from "typeorm";
export default abstract class TrackingDate {
    @CreateDateColumn({ type: "timestamptz", update: false })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
}
