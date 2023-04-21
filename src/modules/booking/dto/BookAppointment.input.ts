import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import {
  AppointmentBookingEntity,
  AppointmentBookingStatus,
} from 'src/entities/Booking.entity';

@InputType()
export class BookAppointmentInput extends PartialType(
  AppointmentBookingEntity,
) {
  @Field(() => Int)
  customerId: number;

  @Field(() => Int, { nullable: true })
  serviceId: number;

  @Field(() => Int, { nullable: true })
  staffId: number;

  @Field(() => Date)
  lastDate: Date;

  @Field(() => Date)
  date: Date;

  @Field({ defaultValue: AppointmentBookingStatus.booked })
  status: string;

  @Field({ defaultValue: '#EEEEEE' })
  color: string;

  @Field({ nullable: true })
  note: string;

  @Field(() => Int)
  storeId: number;

  @Field({ defaultValue: true })
  isActive: boolean;

  @Field({ defaultValue: false })
  isCheckIn: boolean;

  @Field(() => Int, { nullable: true })
  labelId: number;

  @Field()
  created: Date;

  @Field({ defaultValue: false })
  remiderSent: boolean;

  @Field({ defaultValue: false })
  followUpSent: boolean;

  @Field({ defaultValue: false })
  didNotShow: boolean;

  @Field({ defaultValue: false })
  didNotShowSent: boolean;
}
