export class FindUsersDto {
    pageNumber: number = 0;
    pageSize: number = 10;
    sortField?: string = '';
    sortOrder: string = 'asc';
    search?: string;
    filter?: string;
}