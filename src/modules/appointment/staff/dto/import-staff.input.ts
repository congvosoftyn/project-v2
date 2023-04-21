import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class ListImportStaff {
  @Field(() => [ImportStaffInput])
  list: Array<ImportStaffInput>;
}

@InputType()
export class ImportStaffInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  directLink: string;

  @Field({ nullable: true })
  description: string;
}
