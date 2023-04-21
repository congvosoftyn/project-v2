import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddFavorStoreInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  categories: string;

  @Field(() => Int)
  priceRange: number;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  address?: string;

  @Field(() => String)
  address2?: string;

  @Field(() => String)
  city?: string;

  @Field(() => String)
  state?: string;

  @Field(() => String)
  zipcode?: string;

  @Field(() => Int)
  latitude: number;

  @Field(() => Int)
  longitude: number;

  @Field(() => String)
  secretKey: string;

  @Field(() => String)
  icon: string;

  @Field(() => String)
  image?: string;

  @Field(() => String)
  subDomain: string;

  @Field(() => String)
  website?: string;
}
