import { IsEmail, IsString } from "class-validator";

export class UpdateStoreDto {
    @IsString()
    name: string;

    @IsString()
    categories: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsString()
    zipcode: string;

    @IsString()
    icon: string;

    @IsString()
    image: string;

    timezone: string = 'America/Chicago';
    bookingSlotSize: number = 15;
    notes: string;
    cancelTime: number = 0;
}