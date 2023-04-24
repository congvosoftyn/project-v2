import { PartialType } from "@nestjs/swagger";
import { AppointmentDto, PackageBooking, ServiceBooking, } from "./create-booking.dto";
import {AppointmentBookingStatus} from "../../../entities/Booking.entity";

class UpdateService extends PartialType(ServiceBooking) {
    delete: boolean = true;
    bookingInfoId: number;
}

class UpdatePackage extends PartialType(PackageBooking) {
    delete: boolean = true;
    bookingInfoId: number;
    price: number;
    staffId: number;
    id: number;
}

export class UpdateBookingDto extends PartialType(AppointmentDto) {
    packages?: UpdatePackage[];
    services?: UpdateService[];
}

export class CancelBookingDto {
    reason?: string;
    status: AppointmentBookingStatus.canceled;
}
