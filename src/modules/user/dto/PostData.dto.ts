import { IsNotEmpty } from "class-validator";

export class PostDataDto {
    @IsNotEmpty()
    refreshToken: string;

    @IsNotEmpty()
    token: string;
}