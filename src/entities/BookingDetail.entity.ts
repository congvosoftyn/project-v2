import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { Field, Int, Float } from '@nestjs/graphql';
import { ProductEntity } from './Product.entity';
import { StaffEntity } from './Staff.entity';
import { BookingEntity } from './Booking.entity';
import { PackageEntity } from './Package.entity';


@Entity('booking_detail')
export class BookingDetailEntity extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => BookingEntity || null, { nullable: true })
  @ManyToOne(() => BookingEntity, booking => booking.bookingInfo)
  @JoinColumn({ name: 'bookingId' })
  booking: BookingEntity;

  @Field(() => Int,)
  @Column({ type: 'int' })
  bookingId: number;

  @Field(() => ProductEntity || null, { nullable: true })
  @ManyToOne(() => ProductEntity, service => service.bookingInfo)
  @JoinColumn({ name: 'serviceId' })
  service: ProductEntity;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  serviceId: number;

  @Field(() => [StaffEntity] || null, { nullable: true })
  @ManyToOne(() => StaffEntity, staff => staff.bookingInfos)
  @JoinColumn({ name: 'staffId' })
  staff: StaffEntity;

  @Column({ type: 'int' })
  @Field(() => Int)
  staffId: number;

  @Field(() => [PackageEntity] || null, { nullable: true })
  @ManyToOne(() => PackageEntity, pack => pack.bookingInfo)
  @JoinColumn({ name: 'packageId' })
  packages: PackageEntity;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  packageId: number;

  @Field(() => Float)
  @Column("float")
  price: number;

  @Column({ default: false, type: "boolean" })
  @Field({ defaultValue: false })
  deleted: boolean;

  @Field()
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}
