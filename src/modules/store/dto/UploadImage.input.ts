import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ImageInput {
    @Field()
    image: string;
    @Field()
    thumb: string;
}

@InputType()
export class UploadImageInput {
    @Field(()=>[ImageInput])
    pictures: Array<ImageInput>;
}
