export class CreateStoreDto {
    name: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    categories: string;
    phoneNumber: string;
    image: string;
    timezone: string;
    bookingSlotSize: number = 15;
    notes: string;
    cancelTime: number = 0;
}