export class PaginationDto {
  constructor(content: any, count: number, page?: number, size?: number) {
    return {
      content: content,
      totalPages: count % size > 0 ? (count - (count % size)) / size + 1 : count / size,
      totalElements: count,
      page: +page || 0,
      size: +size || 50,
    };
  }
  content: [];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}
