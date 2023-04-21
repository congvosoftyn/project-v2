import { Field, Int, ObjectType, PartialType } from "@nestjs/graphql";
import { AppointmentBookingStatus } from "src/entities/Booking.entity";
import { Column } from "typeorm";

@ObjectType()
export class OutputCustomerDto{
    @Field(() => Int)
    id: number;

    @Field(() => String)
    phoneNumber: string;

    @Field(() => String)
    countryCode: string;

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;
}

@ObjectType()
export class OutputDto{
    @Field(() => Int)
    id: number;

    @Field(() => String)
    name: string;
}

@ObjectType()
export class OutputLabelDto extends PartialType(OutputDto){
    @Field(() => String)
    color: string;
}

@ObjectType()
export class AppointmentBookingDto {
    @Field(() => Int)
    id: number;

    @Field(() => Int, { nullable: true })
    customerId: number;

    @Field(() => OutputCustomerDto)
    customer: OutputCustomerDto;

    @Field(() => Int, { nullable: true })
    serviceId: number;

    @Field(() => Int, { nullable: true })
    staffId: number;

    @Field(() => OutputDto)
    staff: OutputDto;

    @Field(() => OutputDto)
    service: OutputDto;

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

    @Field({ defaultValue: true })
    @Column({ default: true })
    isActive: boolean;

    @Field({ defaultValue: false })
    isCheckIn: boolean;

    @Field(() => Int, { nullable: true })
    labelId: number;

    @Field(() => OutputLabelDto, { nullable: true })
    label: OutputLabelDto;

    @Field({ defaultValue: false })
    remiderSent: boolean;

    @Field({ defaultValue: false })
    followUpSent: boolean;

    @Field({ defaultValue: false })
    didNotShow: boolean;

    @Field({ defaultValue: false })
    didNotShowSent: boolean;

    @Field(() => Int, { defaultValue: 0 })
    duration: number;
}