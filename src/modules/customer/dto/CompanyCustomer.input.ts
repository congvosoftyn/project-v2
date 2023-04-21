import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength, } from 'class-validator';

@InputType()
export class CustomerInputDTO {
  @MinLength(10)
  @MaxLength(20)
  @Matches(/\d+/g, { message: 'Phone Number too weak' })
  @Field(() => String)
  phoneNumber: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @IsString()
  @Field(() => String)
  firstName: string;

  @IsString()
  @Field(() => String)
  lastName: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  dob?: number;

  @IsString()
  @IsOptional()
  @Field(() => String)
  gender?: string;

  @IsString()
  @IsOptional()
  @Field(() => String)
  avatar?: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  following?: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  follower?: number;

  @IsString()
  @IsOptional()
  @Field(() => String)
  facebook?: string;

  @IsString()
  @IsOptional()
  @Field(() => String)
  instagram?: string;

  @IsString()
  @IsOptional()
  @Field(() => String)
  twitter?: string;

  @IsString()
  @IsOptional()
  @Field(() => String)
  pinterest?: string;

  @IsString()
  @IsOptional()
  @Field(() => String)
  website?: string;

  @IsString()
  @IsOptional()
  @Field(() => String)
  description?: string;
}

@InputType()
export class CompanyCustomerInputDTO {
  @IsNumber()
  @Field(() => Int)
  totalPoint: number;

  @IsString()
  @IsOptional()
  @Field(() => String)
  nickname?: string;

  @IsDateString()
  @Field(() => Date)
  lastCheckIn: Date;

  @IsString()
  @Field(() => String)
  note: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  balance?: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  giftCardBalance?: number;

  @Field(() => CustomerInputDTO)
  customer: CustomerInputDTO;
}
