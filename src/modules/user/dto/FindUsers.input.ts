import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class FindUsersInput {
    @Field(() => Int, { defaultValue: 0 })
    pageNumber: number = 0;
    @Field(() => Int, { defaultValue: 10 })
    pageSize: number = 10;
    @Field(() => String, { defaultValue: '' })
    sortField?: string = '';
    @Field(() => String, { defaultValue: 'asc' })
    sortOrder: string = 'asc';
    @Field(() => String)
    search?: string;
    @Field(() => String)
    filter?: string;
}