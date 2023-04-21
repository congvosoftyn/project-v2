import { Field, InputType, Int } from '@nestjs/graphql';
import {  IsEmail,  IsNumber,  IsOptional,  IsString,  Matches,  MaxLength,  MinLength,} from 'class-validator';

@InputType()
export class CreateAccountInput {
  @IsString()
  @IsOptional()
  @Field(()=>String)
  fullName?: string;

  @IsEmail()
  @Field(()=>String)
  email: string;
  
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  @Matches(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,12}$/, {
    message:
      'Password must be at least six characters long and have a special uppercase character!',
  })
  @Field(()=>String)
  password: string;
  
  @IsOptional()
  @IsNumber()
  @Field(()=>Int)
  packageId?: number;
}
