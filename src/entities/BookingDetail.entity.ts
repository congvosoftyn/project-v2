import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { ServiceEntity } from './service.entity';
import { StaffEntity } from './Staff.entity';
import { BookingEntity } from './Booking.entity';
import { PackageEntity } from './Package.entity';

@Entity('booking_detail')
export class BookingDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", name: "start_time" })
  startTime: string;

  @Column({ type: "text", name: "end_time" })
  endTime: string;

  @ManyToOne(() => BookingEntity, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: 'bookingId' })
  booking: BookingEntity;

  @Column({ type: 'int' })
  bookingId: number;

  @ManyToOne(() => ServiceEntity, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column({ type: 'int' })
  serviceId: number;

  @ManyToOne(() => StaffEntity)
  @JoinColumn({ name: 'staffId' })
  staff: StaffEntity;

  @Column({ type: 'int' })
  staffId: number;

  @ManyToOne(() => PackageEntity, { onDelete: "CASCADE", onUpdate: "CASCADE", nullable: true })
  @JoinColumn({ name: 'packageId' })
  package: PackageEntity;

  @Column({ type: 'int', nullable: true })
  packageId: number;

  @Column("float")
  price: number;

  @Column({ default: 0 })
  duration: number;

  @Column({ default: false, type: "boolean" })
  deleted: boolean;

  // @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  // public created_at: Date;

  // @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  // public updated_at: Date;
}
