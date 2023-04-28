import { IDetail } from "./detail.interface";

export interface IBooking {
    id: number;
    customerId: number;
    date: Date;
    bookingDetails: IDetail[];
    status: string;
    color: string;
    note: string;
    storeId: number;
    isCheckIn: boolean;
    duration: number;
    reason?: string; 
}