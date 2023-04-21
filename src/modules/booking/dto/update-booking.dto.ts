import { PartialType } from "@nestjs/swagger";
import { AppointmentDto, CreateAppointmentDto, Package, Service } from "./create-booking.dto";
import {AppointmentBookingStatus} from "../../../entities/Booking.entity";

class UpdateService extends PartialType(Service) {
    delete: boolean = true;
    bookingInfoId: number;
}

class UpdatePackage extends PartialType(Package) {
    delete: boolean = true;
    bookingInfoId: number;
}

export class UpdateBookingDto extends PartialType(AppointmentDto) {
    packages?: UpdatePackage[];
    services?: UpdateService[];
}

export class CancelBookingDto {
    reason?: string;
    status: AppointmentBookingStatus.canceled;
}
