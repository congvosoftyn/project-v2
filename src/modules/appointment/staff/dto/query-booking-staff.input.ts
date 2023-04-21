import { Field, InputType } from "@nestjs/graphql";

enum ViewE {
    day = 'day',
    day_3 = 'day_3',
    week = 'week',
}

@InputType()
export class QueryBookingByStaffInput {
    @Field(() => String, { nullable: true, defaultValue: '' })
    staffId?: string = '';

    @Field(() => String, { defaultValue: new Date().toLocaleDateString("sv") })
    date: string = new Date().toLocaleDateString("sv");

    @Field(() => String, { defaultValue: ViewE.day })
    view: string = ViewE.day;
}