import { IsEmail, IsOptional, IsString, IsLatLong, IsLongitude } from "class-validator";

export class EditStoreDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    categories?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    address2?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    zipcode?: string;

    // // @IsLatLong()
    // @IsOptional()
    // latitude?: number;

    // // @IsLongitude()
    // @IsOptional()
    // longitude?: number;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsString()
    @IsOptional()
    image?: string;
}