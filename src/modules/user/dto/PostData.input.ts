import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class PostDataInput {
    @IsNotEmpty()
    @Field(()=>String)
    refreshToken: string;

    @IsNotEmpty()
    @Field(()=>String)
    token: string;
}