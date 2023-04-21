import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { StoreEntity } from "./Store.entity";

@Entity('customer')
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column({ default: '+1' })
  countryCode: string = "+1";

  @Column({ default: 'us' })
  isoCode: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  dob: number;

  @Column({ nullable: true })
  gender: string; //male or female

  @Column({ nullable: true, type: 'text' })
  avatar: string;

  @CreateDateColumn({ precision: null, type: "timestamp" })
  created: Date;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => StoreEntity, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "storeId" })
  store: StoreEntity;

  @Column()
  storeId: number;

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  getPhoneNumber() {
    return this.countryCode + this.phoneNumber;
  }
}