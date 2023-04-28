export interface ICustomer {
    id: number;
    phoneNumber: string;
    countryCode: string;
    isoCode: string;
    email?: string;
    firstName: string;
    lastName: string;
    dob?: number;
    gender: string; //male or female
    avatar?: string;
    description?: string;
}