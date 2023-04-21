import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString, IsLatLong, IsLongitude } from "class-validator";

@InputType()
export class EditStoreInput {
    @IsString()
    @Field(() => String)
    name: string;

    @IsString()
    @Field(() => String)
    categories: string;

    @IsString()
    @Field(() => String)
    phoneNumber: string;

    @IsString()
    @IsEmail()
    @Field(() => String)
    email: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    address?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    address2?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    city?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    state?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    zipcode?: string;

    @IsLatLong()
    @IsOptional()
    @Field(() => Float)
    latitude?: number;

    @IsLongitude()
    @IsOptional()
    @Field(() => Float)
    longitude?: number;

    @IsString()
    @IsOptional()
    @Field(() => String)
    icon?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    image?: string;
}