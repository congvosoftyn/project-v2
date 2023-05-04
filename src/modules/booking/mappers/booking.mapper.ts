import { BookingEntity } from "src/entities/Booking.entity";
import { IBooking } from "../interfaces/booking.interface";
import { IDetail } from "../interfaces/detail.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BookingMapper {
    convertReponseBooking(booking: BookingEntity) {
        let bookingConvert: IBooking;
        bookingConvert = {
            ...bookingConvert,
            id: booking.id,
            customerId: booking.customerId,
            date: booking.date,
            status: booking.status,
            color: booking.color,
            note: booking.note,
            storeId: booking.storeId,
            isCheckIn: booking.isCheckIn,
            duration: booking.duration,
            // reason: booking.reason,
        }

        let bookingDetails: IDetail[] = [];

        for (const detail of booking.bookingDetails) {
            bookingDetails.push({
                id: detail.id,
                startTime: detail.startTime,
                endTime: detail.endTime,
                bookingId: booking.id,
                price: detail.price,
                duration: detail.duration,
                startffId: detail.staffId,
                service: detail.packageId ? null : detail.service,
                package: detail.package
            })
        }

        bookingConvert.bookingDetails = bookingDetails;

        return bookingConvert;
    }
}