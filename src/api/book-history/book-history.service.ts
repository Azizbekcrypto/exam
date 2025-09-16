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

  // // 🔎 Bitta kitob tarixi
  // async getHistoryByBook(bookId: string) {
  //   const data = await this.bookHistoryRepo.find({
  //     where: { book },            // endi nested object ishlatmaymiz
  //     relations: ['user', 'book'],  // join qilamiz
  //     order: { action_date: 'DESC' }, // TypeScript xatosiz
  //   });
  
  //   if (!data || data.length === 0) {
  //     throw new HttpException('Book history not found', 404);
  //   }
  
  //   return successRes(data);
  // }
  
  // async getHistoryByUser(userId: string) {
  //   const data = await this.bookHistoryRepo.find({
  //     where: { userId },            // nested object o‘rniga FK ishlatamiz
  //     relations: ['book', 'user'],
  //     order: { action_date: 'DESC' },
  //   });
  
  //   if (!data || data.length === 0) {
  //     throw new HttpException('User history not found', 404);
  //   }
  
  //   return successRes(data);
  // }
  

  // async getBookHistory(bookId: string): Promise<BookHistory[]> {
  //   return await this.bookHistoryRepo.find({
  //     where: { book: { id: bookId } },
  //     relations: ['user', 'book'],
  //   });
  // }
}
