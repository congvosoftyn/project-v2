import { Field, Int, ObjectType, PartialType } from "@nestjs/graphql";
import { AppointmentBookingStatus } from "src/entities/Booking.entity";
import { AppointmentLabelEntity } from "src/entities/AppointmentLabel.entity";
import { CustomerEntity } from "src/entities/Customer.entity";
import { PackageCategoryEntity } from "src/entities/Package.entity";
import { ProductEntity } from "src/entities/Product.entity";

@ObjectType()
class StaffRes {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    phoneNumber: string;

    @Field({ nullable: true })
    avatar: string;

    @Field({ nullable: true })
    directLink: string;

    @Field({ nullable: true })
    description: string;

    @Field(() => Int, { nullable: true })
    storeId: number;
}

@ObjectType()
class ServiceB extends PartialType(ProductEntity) {
    @Field(() => Int)
    bookingInfoId: number;

    @Field(() => Boolean, { defaultValue: true })
    deleted: boolean;

    @Field(() => Int)
    staffId: number;

    @Field(() => StaffRes)
    staff: StaffRes
}

@ObjectType()
class PackageC extends PartialType(PackageCategoryEntity) {
    @Field(() => Int)
    bookingInfoId: number;

    @Field(() => Boolean, { defaultValue: true })
    deleted: boolean;

    @Field(() => Int, { defaultValue: 0 })
    duration: number;

    @Field(() => Int)
    staffId: number;

    @Field(() => StaffRes)
    staff: StaffRes
}

@ObjectType()
export class ReponseBookingInput {
    @Field(() => Int)
    id: number;

    @Field(() => CustomerEntity)
    customer: CustomerEntity;

    @Field(() => Int || null, { nullable: true })
    customerId: number;

    @Field(() => [ServiceB] || null, { nullable: true })
    services: ServiceB[];

    @Field(() => [PackageC] || null, { nullable: true })
    packages: PackageC[];

    @Field(() => Date || null, { nullable: true })
    lastDate: Date;

    @Field(() => Date || null, { nullable: true })
    date: Date;

    @Field({ defaultValue: AppointmentBookingStatus.booked })
    status: string;

    @Field({ defaultValue: '#EEEEEE' })
    color: string;

    @Field({ nullable: true })
    note: string;

    @Field(() => Int || null, { nullable: true })
    storeId: number;

    @Field({ defaultValue: true })
    isActive: boolean;

    @Field({ defaultValue: false })
    isCheckIn: boolean;

    @Field(() => AppointmentLabelEntity || null, { nullable: true })
    label: AppointmentLabelEntity;

    @Field(() => Int, { nullable: true })
    labelId: number;

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

    @Field(() => Int, { defaultValue: 0 })
    extraTime: number;
}