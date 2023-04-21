import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DeleteCustomerDto {
    @Field(() => String)
    message: string;
}