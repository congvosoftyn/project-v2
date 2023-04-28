import { PartialType } from "@nestjs/swagger";
import { AppointmentDto, BodyServiceAndPackageBooking } from "./create-booking.dto";
import { AppointmentBookingStatus } from "../../../entities/Booking.entity";

export class UpdateServiceAndPackageBooking {
    id: number;
    staffId?: number = null;
    startTime: string;
    duration: number;
    price: number;
}

export class DetailBooking {
    id: number;
    bookingId: number;
    staffId: number;
    serviceId: number;
    packageId?: number;
    deleted: boolean = false;
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
}

export class UpdateBookingDto extends PartialType(AppointmentDto) {
    packages?: UpdateServiceAndPackageBooking[];
    services?: UpdateServiceAndPackageBooking[];
    bookingDetails: DetailBooking[];
}

export class CancelBookingDto {
    reason?: string;
    status: AppointmentBookingStatus.canceled;
}
