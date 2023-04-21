import { IsEmail, IsString } from "class-validator";

export class VerifyEmailDto {
    @IsString()
    code: string;

    @IsEmail()
    email: string;
}