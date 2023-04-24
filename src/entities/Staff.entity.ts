import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { ServiceEntity } from './service.entity';
import { TimeOffEntity } from './TimeOff.entity';
import { WorkingHourEntity } from './WorkingHour.entity';
import { StoreEntity } from './Store.entity';

@Entity('staff')
export class StaffEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToMany((type) => ServiceEntity, (service) => service.staffs, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinTable()
  services: ServiceEntity[];

  @Column({ nullable: true })
  description: string;

  @OneToMany((type) => WorkingHourEntity, (hour) => hour.staff, { eager: true, cascade: true, })
  workingHours: WorkingHourEntity[];

  @Column({ default: 15 })
  breakTime: number;

  @OneToMany((type) => TimeOffEntity, (hour) => hour.staff, { eager: true, cascade: true, })
  timeOffs: TimeOffEntity[];

  @ManyToOne((type) => StoreEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: StoreEntity;

  @Column({ nullable: false })
  storeId: number;

  @Column({ default: false })
  isActive: boolean;
}
