import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCompanyCustomerDto {
    @IsNumber()
    id:number;

    @IsNumber()
    @IsOptional()
    totalPoint?: number;
    
    @IsOptional()
    @IsString()
    nickname?: string;
    
    @IsOptional()
    @IsDate()
    lastCheckIn?: Date;
    
    @IsOptional()
    @IsString()
    note?: string;
    
    @IsOptional()
    @IsNumber()
    balance?: number;
    
    @IsOptional()
    @IsNumber()
    giftCardBalance?: number;
    
    customer: UpdateCustomerDto;
}


export class AddressDto {
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
}

export class UpdateCustomerDto {
    phoneNumber?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    dob?: number;
    gender?: string;
    avatar?: string;
    following?: number;
    follower?: number;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
    website?: string;
    description?: string;
}