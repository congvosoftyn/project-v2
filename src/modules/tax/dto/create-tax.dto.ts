export class CreateTaxDto {
    name: string;
    rate: number = 8.25;
    type: number = 0;
    zipCode: number;
}
