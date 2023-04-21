import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { StoreEntity } from './Store.entity';

@Entity('setting')
export class SettingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 15 }) // in minutes
  bookingSlotSize: number;

  @Column({ default: 0 })
  cancellationPolicy: number; // 0 for anythime, unit in hour

  @Column({ default: false })
  offHoursBooking: boolean; //allow customer book off hour

  @Column({ default: false })
  doubleBooking: boolean; //allow customer book off hour

  @Column({ default: true })
  customServiceDuration: boolean;

  @Column({ default: true })
  customServiceCost: boolean;

  @Column({ default: 15 })
  appointmentSlots: number; // slot in calendar, unit in minute

  @Column({ default: 1 })
  weekStartDay: number; // 1 for Monday, this setting for calendar

  @Column({ default: true })
  reminder: boolean; // turn on of reminder

  @Column({ default: 60 })
  reminderInMinute: number;

  @Column({ default: false })
  rebookingReminder: boolean;

  @Column({ default: true })
  bookingChanges: boolean;

  @Column({ default: false })
  folllowUp: boolean;

  @Column({ default: 60 })
  folllowUpAfterMinute: number;


  @OneToOne((type) => StoreEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity;

  @Column({ type: 'int' })
  storeId: number;
}
