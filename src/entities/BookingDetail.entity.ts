import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { ProductEntity } from './Product.entity';
import { StaffEntity } from './Staff.entity';
import { BookingEntity } from './Booking.entity';
import { PackageEntity } from './Package.entity';


@Entity('booking_detail')
export class BookingDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BookingEntity, booking => booking.bookingInfo)
  @JoinColumn({ name: 'bookingId' })
  booking: BookingEntity;

  @Column({ type: 'int' })
  bookingId: number;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'serviceId' })
  service: ProductEntity;

  @Column({ type: 'int', nullable: true })
  serviceId: number;

  @ManyToOne(() => StaffEntity)
  @JoinColumn({ name: 'staffId' })
  staff: StaffEntity;

  @Column({ type: 'int' })
  staffId: number;

  @ManyToOne(() => PackageEntity)
  @JoinColumn({ name: 'packageId' })
  packages: PackageEntity;

  @Column({ type: 'int', nullable: true })
  packageId: number;

  @Column("float")
  price: number;

  @Column({ default: false, type: "boolean" })
  deleted: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}
