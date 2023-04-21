import { PartialType } from "@nestjs/swagger";
import { CreateServiceDto } from "src/modules/appointment/service/dto/create-service.dto";

class ServiceDto extends PartialType(CreateServiceDto) {
    id: number;
}

export class CreatePackageCategoryDto {
    name: string;
    categoryId: number;
    services: ServiceDto[];
    // cost: string;
    price: number;
}
