export class QueryStaffServices {
  constructor(page?: number, size?: number) {
    return {
      page: page || 0,
      size: size || 50,
    };
  }
  page?: number = 0;
  size?: number = 50;
  keyword?: string = '';
}
