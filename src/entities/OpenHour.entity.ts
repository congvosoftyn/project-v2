import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { StoreEntity } from "./Store.entity";

@Entity({ name: 'open_hour', orderBy: { day: "ASC" } })
export class OpenHourEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    day: number;

    @Column({ default: '09:00' })
    fromHour: string;

    @Column({ default: '17:00' })
    toHour: string;

    @Column({ default: true })
    open: boolean;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: StoreEntity;

    @Column({ type: 'int' })
    storeId: number;
}