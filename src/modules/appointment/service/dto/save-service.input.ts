import { Field, InputType, PartialType } from '@nestjs/graphql';
import { ProductEntity } from 'src/entities/Product.entity';

@InputType()
export class SaveServiceInput extends PartialType(ProductEntity) {
  @Field(() => String, { nullable: true })
  photo: string;
}
