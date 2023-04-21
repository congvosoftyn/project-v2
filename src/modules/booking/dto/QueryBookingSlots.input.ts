import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class QueryBookingSlotsInput {
    @Field(() => Date)
    date: Date;
    @Field(() => Date)
    timezone: Date;
    @Field(() => Int)
    staffId: number;
}