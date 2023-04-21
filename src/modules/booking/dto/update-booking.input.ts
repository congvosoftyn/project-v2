import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { AppointmentI, CreateAppointmentInput, PackageI, Service } from "./create-booking.input";

@InputType()
class UpdateServiceI extends PartialType(Service) {
    @Field(() => Boolean, { defaultValue: true })
    delete: boolean = true;

    @Field(() => [Int])
    bookingInfoId: number;
}

@InputType()
class UpdatePackageI extends PartialType(PackageI) {
    @Field(() => Boolean, { defaultValue: true })
    delete: boolean = true;

    @Field(() => [Int])
    bookingInfoId: number;
}

@InputType()
export class UpdateBookingInput extends PartialType(AppointmentI) {
    @Field(()=>[UpdatePackageI],{nullable: true})
    packages?: UpdatePackageI[];

    @Field(()=>[UpdateServiceI],{nullable: true})
    services?: UpdateServiceI[];
}