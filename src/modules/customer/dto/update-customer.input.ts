import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNumber, IsString, IsOptional } from "class-validator";
import { UpdateCompanyCustomerInput } from "./update-comapny-customer.input";

@InputType()
export class AddressInput {
    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    address2?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    zipcode?: string;

    @IsString()
    @IsOptional()
    country?: string;
}

@InputType()
export class UpdateCustomerInput {
    @IsNumber()
    @Field(() => Int)
    id: number;

    @IsString()
    @Field(() => String,{defaultValue: '+1'})
    countryCode: string = '+1';

    @IsString()
    @IsOptional()
    @Field(() => String)
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    email?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    firstName: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    lastName: string;

    @IsNumber()
    @IsOptional()
    @Field(() => Int)
    dob?: number;

    @IsString()
    @IsOptional()
    @Field(() => String)
    gender?: string;

    @IsString()
    @IsOptional()
    @Field(() => String,{defaultValue: ''})
    avatar?: string = '';

    @IsString()
    @IsOptional()
    @Field(() => String,{defaultValue: 'us'})
    isoCode?: string = 'us';

    @IsNumber()
    @IsOptional()
    @Field(() => Int)
    following?: number;

    @IsNumber()
    @IsOptional()
    @Field(() => Int)
    follower?: number;

    @IsString()
    @IsOptional()
    @Field(() => String)
    facebook?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    instagram?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    twitter?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    pinterest?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    website?: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    description?: string;

    @Field(()=>AddressInput)
    address?: AddressInput;

    @Field(()=>UpdateCompanyCustomerInput)
    companyCustomer: UpdateCompanyCustomerInput;
}
