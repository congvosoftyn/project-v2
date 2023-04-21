import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { StaffEntity } from "./Staff.entity";

@Entity({ name: 'working_hour', orderBy: { day: 'ASC' } })
export class WorkingHourEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    day: number; //0 for Sunday, 1 for Monday, and so on

    @Column({ default: '09:00' })
    fromHour: string;

    @Column({ default: '17:00' })
    toHour: string;

    @Column({ default: true })
    open: boolean; // Dayoff will be set false

    @ManyToOne(type => StaffEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'staffId' })
    staff: StaffEntity;

    @Column({ type: 'int' })
    staffId: number;
}