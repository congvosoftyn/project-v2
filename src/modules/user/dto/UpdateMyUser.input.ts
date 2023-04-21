import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateMyUserInput {
    @IsInt()
    @Field(()=>Int)
    id: number;

    @IsString()
    @Field(()=>String)
    fullName: string;

    @IsString()
    @IsOptional()
    @Field(()=>String)
    newPassword: string;

    @IsString()
    @IsOptional()
    @Field(()=>String)
    oldPassword: string;
}