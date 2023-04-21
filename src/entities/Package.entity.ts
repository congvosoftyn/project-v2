import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./Product.entity";
import { CategoryEntity } from "./Category.entity";

@Entity({ name: "package" })
export class PackageEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => ProductEntity, product => product.package)
    @JoinTable()
    services: ProductEntity[];

    @ManyToOne(() => CategoryEntity)
    @JoinColumn({ name: 'categoryId' })
    category: CategoryEntity;

    @Column({ type: "int" })
    categoryId: number;

    @Column({ type: "float" })
    price: number;

    @Column({ default: true, type: "boolean" })
    deleted: boolean;
}
