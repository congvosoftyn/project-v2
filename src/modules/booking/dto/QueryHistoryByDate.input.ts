import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class QueryHistoryByDateInput {
    @Field(() => Date)
    start: Date;
    @Field(() => Date)
    end: Date;
    @Field(() => Int)
    staffId: number;
}