import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString } from "class-validator";

@InputType()
export class LoginInput {
    @IsEmail()
    @Field()
    email: string;

    @IsString()
    @Field()
    password: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    deviceToken?: string;
}