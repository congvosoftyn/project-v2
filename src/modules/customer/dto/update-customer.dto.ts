export class UpdateCustomerDto {
    countryCode: string = '+1';
    phoneNumber?: string;
    email?: string;
    firstName: string;
    lastName: string;
    dob?: number;
    gender?: string;
    avatar?: string = '';
    isoCode?: string = 'us';
}
