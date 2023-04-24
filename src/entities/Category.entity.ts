import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceEntity } from "./service.entity";
import { StoreEntity } from "./Store.entity";
import { PackageEntity } from "./Package.entity";

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: false })
    isActive: boolean;

    @ManyToOne(type => StoreEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: StoreEntity;

    @Column({ type: 'int' })
    storeId: number;

    @OneToMany(type => ServiceEntity, product => product.category, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    services: ServiceEntity[];

    @OneToMany(() => PackageEntity, aPackage => aPackage.category, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    packages: [PackageEntity];
}
