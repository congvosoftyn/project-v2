import { Field, Float, InputType, Int, PartialType } from "@nestjs/graphql";
import { AppointmentBookingStatus } from "src/entities/Booking.entity";

@InputType()
export class Service {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    staffId: number;

    @Field(() => Float, { defaultValue: 0 })
    price: number = 0;

    @Field(() => Int, { nullable: true })
    categoryId?: number;
}

@InputType()
export class PackageI {
    @Field(() => Int)
    id: number;

    @Field(() => Int, { nullable: true })
    categoryId: number;

    @Field(() => Int)
    price: number;

    @Field(() => Int)
    staffId: number;
}

@InputType()
export class AppointmentI {
    @Field(() => Int, { nullable: true })
    customerId?: number;

    @Field(() => Date)
    lastDate: Date;

    @Field(() => Date)
    date: Date;

    @Field(() => String, { defaultValue: AppointmentBookingStatus.booked })
    status: string = AppointmentBookingStatus.booked;

    @Field(() => String, { defaultValue: '#EEEEEE' })
    color: string = '#EEEEEE';

    @Field(() => String, { nullable: true })
    note?: string;

    @Field(() => Int, { nullable: true })
    storeId?: number;

    @Field(() => Boolean, { defaultValue: false })
    isCheckIn: boolean = false;

    @Field(() => Int, { nullable: true })
    labelId?: number;

    @Field(() => Boolean, { defaultValue: false })
    remiderSent: boolean = false;

    @Field(() => Boolean, { defaultValue: false })
    followUpSent: boolean = false;

    @Field(() => Boolean, { defaultValue: false })
    didNotShow: boolean = false;

    @Field(() => Boolean, { defaultValue: false })
    didNotShowSent: boolean = false;

    @Field(() => Int)
    duration: number;

    @Field(() => Int, { defaultValue: 0 })
    extraTime?: number;
}


@InputType()
export class CreateAppointmentInput {
    @Field(() => Int, { nullable: true })
    id?: number;

    @Field(() => [Service])
    services?: Service[];

    @Field(() => [PackageI], { nullable: true })
    packages?: PackageI[];
}
