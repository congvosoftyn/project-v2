import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ResultDeletInput {
    @Field(()=>Int)
    affected: number;
}