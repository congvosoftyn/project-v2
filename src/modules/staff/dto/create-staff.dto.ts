export class CreateStaffDto{
    name: string;
    email?: string;
    phoneNumber: string;
    avatar?: string;
    description?: string;
    breakTime: number = 15;
}