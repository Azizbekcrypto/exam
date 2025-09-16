import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/core';
import type { bookRepository } from 'src/core';
import { ILike } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { successRes } from 'src/infrastructure/response/successRes';


@Injectable()
export class BookService extends BaseService<CreateBookDto, UpdateBookDto, Book> {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: bookRepository,
  ) {
    super(bookRepo);
  }

  // 🔎 Qidirish va filterlash
  async findAllWithFilter(query: any) {
    const where: any = {};

    if (query.title) where.title = ILike(`%${query.title}%`);
    if (query.author) where.author = ILike(`%${query.author}%`);
    if (query.year) where.year = query.year;
    if (query.available !== undefined) where.available = query.available === 'true';

    const data = await this.bookRepo.find({ where });
    return successRes(data);
  }

  // async getBookHistory(id: string) {
  //   const data = await this.bookRepo.findOne({
  //     where: { id },
  //     relations: ['histories', 'histories.user'],
  //   });
  
  //   if (!data) {
  //     throw new HttpException('Book not found', 404);
  //   }
  
  //   return successRes(data.histories?? []);
  // }
  


}


// borow create qilinganda uni sraze historyga yozib ketish kk