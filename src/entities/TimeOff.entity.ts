import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { StaffEntity } from "./Staff.entity";


@Entity({ name: 'staff_time_off', orderBy: { startDate: 'ASC' } })
export class StaffTimeOffEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    allDay: boolean;

    @ManyToOne(type => StaffEntity, { onDelete: 'CASCADE', onUpdate: "CASCADE" })
    @JoinColumn({ name: 'staffId' })
    staff: StaffEntity;

    @Column({ type: 'int', nullable: true })
    staffId: number;

    @Column({ nullable: true })
    note: string;

    @Column({ nullable: true })
    repeat: string; // Daily, Weekly, Monthly

    @Column({ default: 1 })
    repeatEvery: number; // 1 day, 2 week, or 6 month

    @Column("simple-array", { default: "" }) // apply for repeating weekly only
    repeatOn: number[]; // 0: Sunday, 1: Monday, and so on 

    @Column({ precision: null, nullable: true, type: "timestamp" })
    startDate: Date; //repeat start date

    @Column({ precision: null, nullable: true, type: "timestamp" })
    endDate: Date; //repeat end date

    @Column({ default: 30 })
    duration: number;
}