import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { StaffEntity } from 'src/entities/Staff.entity';

@InputType()
export class CreateStaffInput {
    @Field(() => String)
    name: string;
    
    @Field(() => String, { nullable: true })
    email?: string;
    
    @Field(() => String, { nullable: true })
    phoneNumber?: string;
    
    @Field(() => String, { nullable: true })
    avatar?: string;
    
    @Field(() => String, { nullable: true })
    directLink?: string;
    
    @Field(() => String, { nullable: true })
    description?: string;
    
    @Field(() => Int, { nullable: true })
    storeId?: number;
}