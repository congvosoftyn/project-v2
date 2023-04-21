import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetCustomerInput {
  @Field(() => Int, { defaultValue: 0 })
  skip: number = 0;
  @Field(() => Int, { defaultValue: 10 })
  take: number = 10;
  @Field(() => String, { defaultValue: '' })
  search: string = '';
}
