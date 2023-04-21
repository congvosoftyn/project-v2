import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class ContactUsInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsString()
  @Field(() => String)
  name: string;

  @IsString()
  @Field(() => String)
  message: string;
}
