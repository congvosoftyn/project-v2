import { ICustomer } from "src/modules/customer/interfaces/customer.interface";
import { IDetail } from "./detail.interface";

export interface IConvertBooking {
    id: number;
    customer: ICustomer;
    date: Date;
    bookingDetail: IDetail[];
    status: string;
    color: string;
    note: string;
    storeId: number;
    isCheckIn: boolean;
    duration: number;
    reason: string;
}