import { Field, Float, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GetCustomerStoresInput {
    @Field(()=>Float)
    latitude: number;
    @Field(()=>Float)
    longitude: number;
    @Field(()=>Float)
    myLatitude: number;
    @Field(()=>Float)
    myLongitude: number;
    @Field(()=>String)
    search: string;
    @Field(()=>String)
    hasService: string;
    @Field(()=>Int)
    zoom?: number;
    @Field(()=>Int)
    skip: number;
    @Field(()=>Int)
    take: number;
}