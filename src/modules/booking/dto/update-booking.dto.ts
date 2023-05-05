import { PartialType } from "@nestjs/swagger";
import { AppointmentDto } from "./create-booking.dto";
import { AppointmentBookingStatus } from "../../../entities/Booking.entity";

export class DetailBooking {
    id: number;
    bookingId: number;
    staffId: number;
    serviceId: number;
    packageId: number = null;
    deleted: boolean = false;
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
}

export class UpdateBookingDto extends PartialType(AppointmentDto) {
    packageIds?: number[];
    serviceIds?: number[];
    bookingDetails: DetailBooking[];
    staffId: number;
    startTime?: string;
}

export class CancelBookingDto {
    reason?: string;
    status: AppointmentBookingStatus.canceled;
}
