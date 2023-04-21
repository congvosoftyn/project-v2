import { PartialType } from "@nestjs/swagger";
import { CreateStaffDto } from "../../staff/dto/create-staff.dto";
import { NewTaxDto } from "src/modules/pop/tax/dto/NewTax.dto";

class Staff extends PartialType(CreateStaffDto) {
    id?: number;
    name?: string;
}

class Tax extends PartialType(NewTaxDto) {
    id: number;
}

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
    staffs?: Staff[];
    tax?: Tax;
}