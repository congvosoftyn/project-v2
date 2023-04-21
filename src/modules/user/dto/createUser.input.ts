import { Field, InputType, Int } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAccountInput } from './create-account.input';

@InputType()
export class CreateStoreInput {
  @IsNumber()
  @Field(()=>Int)
  id:number;
  @IsString()
  @Field(()=>String)
  name: string;
  @IsString()
  @Field(()=>String)
  address: string;
  @IsString()
  @Field(()=>String)
  city: string;
  @IsString()
  @Field(()=>String)
  state: string;
  @IsString()
  @Field(()=>String)
  zipcode: string;
  @IsString()
  @Field(()=>String)
  categories: string;
  @IsString()
  @Field(()=>String)
  phoneNumber: string;
}

@InputType()
export class CreateUserInput extends PartialType(CreateAccountInput) {
  @Field(()=>CreateStoreInput)
  store: CreateStoreInput;

  @IsString()
  @IsOptional()
  @Field({nullable: true})
  deviceToken?: string;
}
