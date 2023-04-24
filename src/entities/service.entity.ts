import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { StaffEntity } from './Staff.entity';
import { TaxEntity } from './Tax.entity';
import { CategoryEntity } from './Category.entity';
import { PackageEntity } from './Package.entity';

@Entity({ name: 'service' })
export class ServiceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', {
    transformer: {
      to(value) {
        return parseFloat(value)
      },
      from(value) {
        return parseFloat(value)
      }
    }, precision: 11, scale: 2, default: 0
  })
  cost: number;

  @Column('decimal', {
    transformer: {
      to(value) {
        return parseFloat(value)
      },
      from(value) {
        return parseFloat(value)
      }
    }, precision: 11, scale: 2, default: 0
  })
  price: number;

  @Column({ default: 0 })
  stocks: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: true })
  actived: boolean;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ default: 60 })
  duration: number;

  @ManyToOne((type) => TaxEntity, { onDelete: "CASCADE", onUpdate: "CASCADE", nullable: true })
  @JoinColumn({ name: 'taxId' })
  tax: TaxEntity;

  @Column({ type: 'int', nullable: true })
  taxId: number;

  @ManyToOne((type) => CategoryEntity, (category) => category.services)
  category: CategoryEntity;

  @Column({ type: 'int', nullable: true })
  categoryId: number;

  @ManyToMany(() => StaffEntity, (staff) => staff.services, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  staffs: StaffEntity[];

  @ManyToMany((type) => PackageEntity)
  packages: PackageEntity[];
}
