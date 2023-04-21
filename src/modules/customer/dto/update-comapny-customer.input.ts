import { Field, InputType, Int } from "@nestjs/graphql";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdatCCustomerInput {
    @Field(()=>String)
    phoneNumber?: string;
    
    @Field(()=>String)
    email?: string;
    
    @Field(()=>String)
    firstName?: string;
    
    @Field(()=>String)
    lastName?: string;
    
    @Field(() => Int)
    dob?: number;
    
    @Field(()=>String)
    gender?: string;
    
    @Field(()=>String)
    avatar?: string;

    @Field(() => Int)
    following?: number;
    
    @Field(() => Int)
    follower?: number;
    
    @Field(()=>String)
    facebook?: string;
    
    @Field(()=>String)
    instagram?: string;
    
    @Field(()=>String)
    twitter?: string;
    
    @Field(()=>String)
    pinterest?: string;
    
    @Field(()=>String)
    website?: string;
    
    @Field(()=>String)
    description?: string;
}

@InputType()
export class UpdateCompanyCustomerInput {
    @IsNumber()
    @Field(() => Int)
    id: number;

    @IsNumber()
    @IsOptional()
    @Field(() => Int)
    totalPoint?: number;

    @IsOptional()
    @IsString()
    @Field(() => String)
    nickname?: string;

    @IsOptional()
    @IsDate()
    @Field(() => Date)
    lastCheckIn?: Date;

    @IsOptional()
    @IsString()
    @Field(() => String)
    note?: string;

    @IsOptional()
    @IsNumber()
    @Field(() => Int)
    balance?: number;

    @IsOptional()
    @IsNumber()
    @Field(() => Int)
    giftCardBalance?: number;

    @Field(() => UpdatCCustomerInput)
    customer: UpdatCCustomerInput;
}


