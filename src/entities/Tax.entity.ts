import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StoreEntity } from "./Store.entity";
import { ProductEntity } from './Product.entity'

@Entity({ name: 'tax', orderBy: { orderBy: 'ASC' } })
export class TaxEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type:"float" , default: 8.25 })
    rate: number;

    @Column({ default: 0 })
    type: number;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: StoreEntity;

    @Column({ type: 'int' })
    storeId: number;

    @OneToMany(type => ProductEntity, product => product.tax, { cascade: ['insert', 'update'] })
    products: ProductEntity[];
}