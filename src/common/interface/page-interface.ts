export interface IPage<T> {
  data: Array<T>;
  totalElements: number;
  totalPages: number;
  pageSize: number;
}
