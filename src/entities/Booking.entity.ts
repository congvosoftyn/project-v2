import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { StoreEntity } from './Store.entity';
import { CustomerEntity } from './Customer.entity';
import { BookingDetailEntity } from './BookingDetail.entity';

export enum AppointmentBookingStatus {
  booked = 'booked',
  confirmed = 'confirmed',
  arrived = 'arrived',
  completed = 'completed',
  canceled = 'canceled',
}

@Entity('booking')
export class BookingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => CustomerEntity, { cascade: ['insert', 'update'], eager: true, })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Column({ type: 'int' })
  customerId: number;

  @OneToMany(() => BookingDetailEntity, info => info.booking)
  bookingInfo: BookingDetailEntity[];

  @Column({ default: AppointmentBookingStatus.booked }) // danger, warning, ok
  status: string;

  @Column({ default: '#EEEEEE' })
  color: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne((type) => StoreEntity)
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity;

  @Column({ type: 'int' })
  storeId: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isCheckIn: boolean;

  @CreateDateColumn({ precision: null, type: 'timestamp' })
  created: Date;

  @Column({default:0})
  duration: number;

  @Column({default:0})
  extraTime: number;

  @Column({ nullable: true })
  reason: string; // reason cancel booking
}
