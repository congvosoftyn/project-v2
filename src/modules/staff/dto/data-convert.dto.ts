import { BookingEntity } from "src/entities/Booking.entity";
import { PackageEntity } from "src/entities/Package.entity";
import { ServiceEntity } from "src/entities/service.entity";

export class BookingInfo {
    id: number;
    bookingId: number;
    serviceId: number | null;
    staffId: number;
    packageId: number | null;
    price: number;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
    service: ServiceEntity;
    packages: PackageEntity;
    booking: BookingEntity;
}