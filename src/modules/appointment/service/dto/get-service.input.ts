import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GetServiceInput {
    @Field(() => String, { defaultValue: '', nullable: true })
    search?: string = '';

    @Field(() => Int, { defaultValue: 50, nullable: true })
    page?: number = 50;

    @Field(() => Int, { defaultValue: 0, nullable: true })
    size?: number = 0;
}