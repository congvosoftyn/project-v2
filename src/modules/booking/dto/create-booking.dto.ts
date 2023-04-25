import { PartialType } from "@nestjs/swagger";
import { AppointmentBookingStatus } from "src/entities/Booking.entity";

export class BodyServiceAndPackageBooking {
    id: number;
    price: number;
    duration: number;
}

export class AppointmentDto {
    customerId: number;
    date: Date;
    startTime: string;
    status: string = AppointmentBookingStatus.booked;
    color: string = '#EEEEEE';
    note?: string;
    isCheckIn: boolean = false;
    extraTime: number = 0;
    staffId: number;
}

export class CreateAppointmentDto extends PartialType(AppointmentDto) {
    services?: BodyServiceAndPackageBooking[];
    packages?: BodyServiceAndPackageBooking[];
    reason?: string;
}
