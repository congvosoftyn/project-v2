import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FirebaseAuthInput {
    @Field(() => String)
    displayName: string;
    
    @Field(() => String)
    email: string;
    
    @Field(() => Boolean)
    emailVerified: boolean;
    
    @Field(() => Boolean)
    isAnonymous: boolean;
    
    // @Field()
    // metadata: any[];
    
    @Field(() => String)
    phoneNumber: string;
    
    @Field(() => String)
    photoURL: string;

    // @Field()
    // providerData: any[]
    
    @Field(() => String, { defaultValue: 'firebase' })
    providerId: string = 'firebase';
    
    @Field(() => String)
    tenantId: string;
    
    @Field(() => String)
    uid: string;
}