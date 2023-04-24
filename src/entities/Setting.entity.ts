import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { StoreEntity } from './Store.entity';

@Entity('setting')
export class SettingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToOne((type) => StoreEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity;

  @Column({ type: 'int' })
  storeId: number;

  @Column({default: "America/Chicago"})
  timeZone: string;
}
