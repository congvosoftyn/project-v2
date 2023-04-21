import { IsEmail, IsOptional, IsString, IsLatLong, IsLongitude } from "class-validator";

export class EditStoreDto {
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
    @IsOptional()
    icon: string;

    @IsString()
    @IsOptional()
    image: string;
}