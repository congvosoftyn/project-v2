import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import { StoreEntity } from "./Store.entity";


@Entity('discount')
export class DiscountEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: true })
    percentage: boolean;

    @Column({ type: "float", default: 0 })
    amount: number;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: StoreEntity;

    @Column({ type: 'int' })
    storeId: number;

    @Column({ default: 0 })
    orderBy: number;

    @Column({ default: '' })
    description: string;
}