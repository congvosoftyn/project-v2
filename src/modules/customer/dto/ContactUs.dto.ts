import { IsEmail, IsString } from "class-validator";

export class ConstactUsDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    message: string;
}