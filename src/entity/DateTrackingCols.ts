import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

export default class DateTrackingCols {
    @CreateDateColumn({ type: "timestamp", update: false, name: "created_at"})
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", name: "updated_at"})
    updated_at: Date;
}
