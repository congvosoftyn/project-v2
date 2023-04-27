import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("demo_time")
export class DemoEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("datetime")
    date: Date;
}
