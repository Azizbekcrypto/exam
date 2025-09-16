import { FindManyOptions } from 'typeorm';
import { ISuccessRes } from './successRes-interface';

export interface IResponsePagination extends ISuccessRes {
  totalElements: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  from: number;
  to: number;
}

export interface IFindOptions<T> extends FindManyOptions<T> {}
