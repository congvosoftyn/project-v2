import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GetCalendarSlotInput {
    @Field(() => Date)
    date: Date;
    @Field(() => Int)
    staffId: number;
}