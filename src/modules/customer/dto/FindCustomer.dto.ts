import { IsInt, IsOptional, IsString } from "class-validator";

export class FindCustomerDto {
    @IsOptional()
    pageNumber: number = 0;

    @IsOptional()
    pageSize: number = 10;

    @IsString()
    @IsOptional()
    sortField?: string = '';

    @IsString()
    @IsOptional()
    sortOrder: string = 'asc';

    @IsString()
    @IsOptional()
    filter?: string = '';
}