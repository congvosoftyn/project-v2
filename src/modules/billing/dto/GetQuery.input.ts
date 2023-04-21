import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetQueryInput {
  @Field(() => Int, { defaultValue: 0 })
  pageNumber = 0;
  @Field(() => Int, { defaultValue: 10 })
  pageSize = 10;
}
