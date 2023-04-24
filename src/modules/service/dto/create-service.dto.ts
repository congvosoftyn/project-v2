import { PartialType } from "@nestjs/swagger";
import { UpdateServiceDto } from "./update-service.dto";

export class CreateServiceDto extends PartialType(UpdateServiceDto) {
    categoryId: number;
}