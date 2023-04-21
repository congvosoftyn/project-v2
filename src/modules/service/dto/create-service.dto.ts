export class CreateServiceDto {
    name: string;
    cost: number = 0;
    price: number = 0;
    stocks: number = 0;
    description?: string;
    photo?: string;
    thumb?: string;
    color?: string;
    orderBy: number = 0;
    serviceDuration: number = 60;
    SKU?: string;
    categoryId: number;
    staffIds?: number[];
}