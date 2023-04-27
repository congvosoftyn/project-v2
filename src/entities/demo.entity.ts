import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import format from 'date-fns/format';
import parseJSON from 'date-fns/parseJSON';

@Entity("demo_time")
export class DemoEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // @Column("datetime")
    // @Column("timestamp", {
    //     default: () => 'CURRENT_TIMESTAMP',
    //     // transformer: {
    //     //     to: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),
    //     //     from: (value: string) => parseJSON(value),
    //     // },
    // })
    @Column()
    date: Date;
}
