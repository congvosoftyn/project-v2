import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateUserInput {
    @Field(() => Int)
    id: number;
  
    @Field(() => String, { nullable: true })
    fullName: string;
  
    @Field(() => String)
    email: string;
  
    @Field(() => String)
    password: string;
  
    @Field(() => Boolean, { defaultValue: true })
    isActive: boolean;
  
    @Field(() => Boolean, { defaultValue: true })
    isCreator: boolean;
  
    @Field(() => [Int])
    permissionIds: number[];
  
    @Field(() => String, { nullable: true })
    tempPassword: string;
  
    @Field(() => Date, { nullable: true })
    tempPasswordExpire: Date;
  
    @Field(() => String, { nullable: true })
    emailVerifyCode: string;
  
    @Field(() => Boolean, { defaultValue: false })
    emailVerified: boolean;
  
    @Field(() => Int)
    companyId: number;
  
    @Field(()=>String,{nullable: true})
    facebookId: string;
  
    @Field(()=>String,{nullable: true})
    googleId: string;
  
    @Field(()=>String,{nullable: true})
    appleId: string;
  
    @Field(()=>String,{nullable: true})
    image: string;
}