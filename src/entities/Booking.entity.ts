import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { StoreEntity } from './Store.entity';
import { CustomerEntity } from './Customer.entity';
import { BookingDetailEntity } from './BookingDetail.entity';

export enum AppointmentBookingStatus {
  booked = 'BOOKED',
  confirmed = 'CONFIRMED',
  arrived = 'ARRIVED',
  completed = 'COMPLETED',
  canceled = 'CANCELED',
}

@Entity('booking')
export class BookingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => CustomerEntity, { cascade: ['insert', 'update',"remove"]})
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Column({ type: 'int' })
  customerId: number;

  @Column("datetime")
  date: Date;

  @OneToMany(() => BookingDetailEntity, info => info.booking,{onDelete:"CASCADE",onUpdate:"CASCADE"})
  bookingDetail: BookingDetailEntity[];

  @Column({ default: AppointmentBookingStatus.booked }) // danger, warning, ok
  status: string;

  @Column({ default: '#EEEEEE' })
  color: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne((type) => StoreEntity, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity;

  @Column({ type: 'int' })
  storeId: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isCheckIn: boolean;

  @CreateDateColumn({ precision: null, type: 'timestamp' })
  created: Date;

  @Column({ default: 0 })
  duration: number;

  @Column({ nullable: true })
  reason: string; // reason cancel booking
}
