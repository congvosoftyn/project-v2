import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateMyUserDto {
    @IsInt()
    id: number;
    @IsString()
    fullName: string;
    newPassword?: string;
    oldPassword?: string;
    image?: string;
    phoneNumber?: string;
    address?: string;
    zipcodeRequest?: string;
}