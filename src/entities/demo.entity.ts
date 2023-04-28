import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("demo_time")
export class DemoEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("datetime")
    date: Date;

    @Column("datetime", { name: "start_date" })
    startDate: Date;

    @Column("datetime", { name: "end_date" })
    endDate: Date;
}
