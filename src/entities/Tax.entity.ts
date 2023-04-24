import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StoreEntity } from "./Store.entity";

@Entity({ name: "tax" })
export class TaxEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "float", default: "8.25" })
    rate: number;

    @Column({ type: "int", default: 0 })
    type: number;

    @Column({ name: "zip_code" })
    zipCode: number;

    @Column({default:false})
    actived: boolean;

    @ManyToOne(() => StoreEntity, { onDelete: "CASCADE", onUpdate: "CASCADE", nullable: true })
    @JoinColumn({ name: "storeId" })
    store: StoreEntity;

    @Column()
    storeId: number;
}
