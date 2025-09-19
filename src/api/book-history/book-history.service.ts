import { HttpException, Injectable } from '@nestjs/common';
import { CreateBookHistoryDto } from './dto/create-book-history.dto';
import { UpdateBookHistoryDto } from './dto/update-book-history.dto';
import { BookHistory } from 'src/core';
import type {  bookHistoryRepository } from 'src/core';
import { BaseService } from 'src/infrastructure/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { successRes } from 'src/infrastructure/response/successRes';

@Injectable()
export class BookHistoryService extends BaseService<
  CreateBookHistoryDto,
  UpdateBookHistoryDto,
  BookHistory
> {
  constructor(
    @InjectRepository(BookHistory)
    private readonly bookHistoryRepo:  bookHistoryRepository,
  ) {
    super(bookHistoryRepo);
  }

}
