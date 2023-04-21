import { AddressDto, UpdateCompanyCustomerDto } from "./update-comapny-customer.dto";

export class UpdateCustomerDto {
    id: number;
    countryCode: string = '+1';
    phoneNumber?: string;
    email?: string;
    firstName: string;
    lastName: string;
    dob?: number;
    gender?: string;
    avatar?: string = '';
    isoCode?: string = 'us';
    following?: number;
    follower?: number;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
    website?: string;
    description?: string;
    address?: AddressDto;
    companyCustomers?: UpdateCompanyCustomerDto[];
}
