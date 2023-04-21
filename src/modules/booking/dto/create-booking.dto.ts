import { PartialType } from "@nestjs/swagger";
import { AppointmentBookingStatus } from "src/entities/Booking.entity";

export class Service {
    id: number;
    price: number = 0;
    categoryId?: number;
    staffId: number;
}

export class Package {
    id: number;
    price: number;
    staffId: number;
}

export class AppointmentDto {
    customerId?: number;
    date: Date;
    lastDate: Date;
    status: string = AppointmentBookingStatus.booked;
    color: string = '#EEEEEE';
    note?: string;
    storeId?: number;
    isCheckIn: boolean = false;
    labelId?: number;
    remiderSent?: boolean = false;
    followUpSent?: boolean = false;
    didNotShow: boolean = false;
    didNotShowSent: boolean = false;
    duration: number;
    extraTime?: number = 0;
}

export class CreateAppointmentDto extends PartialType(AppointmentDto) {
    services?: Service[];
    packages?: Package[];
    reason?: string;
}
