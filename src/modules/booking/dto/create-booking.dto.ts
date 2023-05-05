import { PartialType } from "@nestjs/swagger";
import { AppointmentBookingStatus } from "src/entities/Booking.entity";

export class AppointmentDto {
    customerId: number;
    date: string = new Date().toLocaleDateString('en-GB');
    startTime: string;
    status: string = AppointmentBookingStatus.booked;
    color: string = '#EEEEEE';
    note?: string;
    isCheckIn: boolean = false;
    extraTime: number = 0;
    staffId: number;
}

export class CreateAppointmentDto extends PartialType(AppointmentDto) {
    serviceIds?: number[];
    packageIds?: number[];
    reason?: string;
}
