import { PartialType } from "@nestjs/swagger";
import { AppointmentBookingStatus } from "src/entities/Booking.entity";

export class ServiceBooking {
    id: number;
    price: number;
    duration: number;
}

export class PackageBooking {
    id: number;
    price: number;
    duration: number;
}

export class AppointmentDto {
    customerId: number;
    date: Date;
    status: string = AppointmentBookingStatus.booked;
    color: string = '#EEEEEE';
    note?: string;
    isCheckIn: boolean = false;
    extraTime?: number = 0;
    staffId: number;
}

export class CreateAppointmentDto extends PartialType(AppointmentDto) {
    services?: ServiceBooking[];
    packages?: PackageBooking[];
    reason?: string;
    storeId: number;
}
