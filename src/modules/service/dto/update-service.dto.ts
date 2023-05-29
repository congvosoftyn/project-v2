export class UpdateServiceDto {
    name: string;
    price: number = 0;
    description?: string;
    photo?: string;
    duration: number = 60;
    staffIds: number[];
    taxId?:number;
}