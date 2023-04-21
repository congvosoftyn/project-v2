import { Field, InputType } from '@nestjs/graphql';
import { CustomerInputDTO } from './CompanyCustomer.input';

@InputType()
export class ImportCustomerInput {
  @Field(() => [CustomerInputDTO])
  customer: CustomerInputDTO[];
}
