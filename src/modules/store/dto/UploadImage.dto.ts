export class UploadImageDto {
    pictures: Array<ImageDto>;
}

export class ImageDto {
    image: string;
    thumb: string;
}