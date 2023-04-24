export class UpdateServiceDto {
    name: string;
    cost: number = 0;
    price: number = 0;
    stocks: number = 0;
    description?: string;
    photo?: string;
    duration: number = 60;
    staffIds: number[];
    taxId?:number;
}