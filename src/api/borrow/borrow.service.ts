import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import {  BookHistory, Borrow } from 'src/core';
import type { barrowRepository } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { BookService } from '../book/book.service';
import { UserService } from '../users/users.service';
import { successRes } from 'src/infrastructure/response/successRes';
import { DataSource } from 'typeorm';
import { HistoryAction } from '../book-history/dto/create-book-history.dto';


@Injectable()
export class BorrowService extends BaseService<
  CreateBorrowDto,
  UpdateBorrowDto,
  Borrow
> {
  constructor(
    @InjectRepository(Borrow) private readonly borrowRepo: barrowRepository,
    private readonly bookService: BookService,
    private readonly usersService: UserService,
    private readonly dataSource: DataSource
  ) {
    super(borrowRepo);
  }
  async createBorrow(createBorrowDto: CreateBorrowDto, bookId: string) {
    const { userId } = createBorrowDto;
    const book = await this.bookService.getRepository.findOne({
      where: { id: bookId },
    });
    if (!book) throw new ConflictException('Book not found');
    if (book.available !== true)
      throw new BadRequestException('Book unavailable');

    await this.usersService.findOneById(userId);
    const borrow = this.borrowRepo.create(createBorrowDto);
    await this.borrowRepo.save(borrow);
    return successRes(borrow, 201);
  }

  // Tranzaksiya Borrow with Book-History
  async createBorrowWithHistory(createBorrowDto: CreateBorrowDto) {
    return this.dataSource.transaction(async (manager) => {
      //  Borrow yaratish
      const borrow = manager.getRepository(Borrow).create({
        borrow_date: createBorrowDto.borrowDate, // DTO Date tipida, to‘g‘ri keladi
        due_date: createBorrowDto.dueDate,
        return_date: createBorrowDto.returnDate ?? null,
        overdue: createBorrowDto.overdue,
        user: { id: createBorrowDto.userId }, // ManyToOne relation
        book: { id: createBorrowDto.bookId }, // ManyToOne relation
      });
      
      const savedBorrow = await manager.getRepository(Borrow).save(borrow);
      

      
      // bokHitsory yaratiw
      const bookHistory = manager.getRepository(BookHistory).create({
        bookId: createBorrowDto.bookId,
        userId: createBorrowDto.userId,
        action: HistoryAction.BORROW,
      });
      await manager.getRepository(BookHistory).save(bookHistory);

      
      return {
        message: 'Borrow and book history created successfully',
        borrow: savedBorrow,
        bookHistory,
      };
    });
  }

  async updateBorrow(id: string, updateBorrowDto: UpdateBorrowDto) {
    const existsBorrow = await this.borrowRepo.findOne({ where: { id } });
    if (!existsBorrow) throw new ConflictException('Borrow not found');
    const { bookId, userId } = updateBorrowDto;
    if (bookId) await this.bookService.findOneById(bookId);
    if (userId) await this.usersService.findOneById(userId);
    const borrow = await this.borrowRepo.update(id, updateBorrowDto);
    const updatedBorrow = await this.borrowRepo.findOne({ where: { id } });
    return successRes(updatedBorrow || {});
  }
}
