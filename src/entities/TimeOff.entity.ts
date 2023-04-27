import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { StaffEntity } from "./Staff.entity";

@Entity({ name: 'time_off'})
export class TimeOffEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
   
    @ManyToOne(type => StaffEntity, { onDelete: 'CASCADE', onUpdate: "CASCADE" })
    @JoinColumn({ name: 'staffId' })
    staff: StaffEntity;

    @Column({ type: 'int', nullable: true })
    staffId: number;

    @Column("datetime")
    startDate: Date; //repeat start date

    @Column("datetime")
    endDate: Date; //repeat end date
}