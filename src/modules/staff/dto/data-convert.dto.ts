import { BookingEntity } from "src/entities/Booking.entity";
import { PackageEntity } from "src/entities/Package.entity";
import { ProductEntity } from "src/entities/Product.entity";

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
    service: ProductEntity;
    packages: PackageEntity;
    booking: BookingEntity;
}