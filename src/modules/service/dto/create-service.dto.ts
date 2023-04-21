export class CreateServiceDto {
    name: string;
    cost: number = 0;
    price: number = 0;
    stocks: number = 0;
    description?: string;
    photo?: string;
    serviceDuration: number = 60;
    categoryId: number;
    staffIds: number[];
    taxId?:number;
}