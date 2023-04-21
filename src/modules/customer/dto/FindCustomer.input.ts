import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class FindCustomerInput {
  @IsInt()
  @Field(() => Int, { defaultValue: 0 })
  pageNumber:number = 0;

  @IsInt()
  @Field(() => Int, { defaultValue: 10 })
  pageSize:number = 10;

  @IsString()
  @Field(() => String)
  sortField:string = '';

  @IsString()
  @Field(() => String, { defaultValue: 'asc' })
  sortOrder:string = 'asc';

  @IsString()
  @Field(() => String, { defaultValue: '' })
  filter:string = '';
}
