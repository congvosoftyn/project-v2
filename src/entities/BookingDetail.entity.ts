import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { ServiceEntity } from './service.entity';
import { StaffEntity } from './Staff.entity';
import { BookingEntity } from './Booking.entity';
import { PackageEntity } from './Package.entity';


@Entity('booking_detail')
export class BookingDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:"start_time", type:"datetime"})
  startTime: Date;

  @Column({name:"end_time", type:"datetime"})
  endTime: Date;

  @ManyToOne(() => BookingEntity, booking => booking.bookingInfo)
  @JoinColumn({ name: 'bookingId' })
  booking: BookingEntity;

  @Column({ type: 'int' })
  bookingId: number;

  @ManyToOne(() => ServiceEntity, { onDelete: "CASCADE", onUpdate: "CASCADE", nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column({ type: 'int', nullable: true })
  serviceId: number;

  @ManyToOne(() => StaffEntity)
  @JoinColumn({ name: 'staffId' })
  staff: StaffEntity;

  @Column({ type: 'int' })
  staffId: number;

  @ManyToOne(() => PackageEntity, { onDelete: "CASCADE", onUpdate: "CASCADE", nullable: true })
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
