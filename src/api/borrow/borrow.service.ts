import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { Book, BookHistory, Borrow, User } from 'src/core';
import type { barrowRepository } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { BookService } from '../book/book.service';
import { UserService } from '../users/users.service';
import { successRes } from 'src/infrastructure/response/successRes';
import { Between, DataSource, IsNull, LessThan } from 'typeorm';
import { HistoryAction } from '../book-history/dto/create-book-history.dto';
import { NotificationService } from '../notification.test/notification.test.service';
import { Cron, CronExpression } from '@nestjs/schedule';


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
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService
  ) {
    super(borrowRepo);
  }


  // Har soatda ishlaydi, due_datega 3 soat qolganda Emailga jonatadi
  @Cron(CronExpression.EVERY_HOUR)
  async notifyBeforeDue() {
    const now = new Date();
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const borrows = await this.borrowRepo.find({
      where: {
        return_date: IsNull(), // hali qaytarilmagan
        due_date: Between(now, threeHoursLater),
      },
      relations: ['user', 'book'],
    });

    for (const borrow of borrows) {
      await this.notificationService.sendDueSoon(borrow.user, borrow);
    }
  }

  // due_date dan o'tganidan ken Har kun bir marta Notification jonatish
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleLateBorrows() {
    const now = new Date();

    // overdue bo‘lgan borrowlarni topish
    const lateBorrows = await this.borrowRepo.find({
      where: {
        return_date: IsNull(),
        due_date: LessThan(now),
      },
      relations: ['user', 'book'],
    });

    for (const borrow of lateBorrows) {
      const daysLate =
        Math.floor((now.getTime() - borrow.due_date.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const penaltyAmount = daysLate * 15000; // 1 kunlik jarima 15 000

      //  borrow yozuviga jarimani saqlash (agar column bo‘lsa)
      borrow.penalty = penaltyAmount;
      await this.borrowRepo.save(borrow);

      // email yuborish
      await this.notificationService.sendLateBorrow(borrow.user, borrow, penaltyAmount);
    }
  }



  // Tranzaksiya Borrow with Book-History
  async createBorrowWithHistory(dto: CreateBorrowDto) {
    return this.dataSource.transaction(async (manager) => {
      // Book tekshirish
      const book = await manager.getRepository(Book).findOne({
        where: { id: dto.bookId },
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      if (!book.available) {
        throw new BadRequestException('Book is not available');
      }

      // User tekshirish
      const user = await manager.getRepository(User).findOne({
        where: { id: dto.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Foydalanuvchi aktiv borrow larini tekshirish (return_date = null)
      const activeBorrows = await manager.getRepository(Borrow).count({
        where: {
          user: { id: dto.userId },
          return_date: IsNull(),
        },
      });
      if (activeBorrows >= 3) {
        throw new BadRequestException('User already borrowed 3 books');
      }

      // due_date → hozirgi sanadan +7 kun
      const now = new Date();
      const dueDate = new Date();
      dueDate.setDate(now.getDate() + 7);

      // Borrow yozuvi yaratish
      const borrow = manager.getRepository(Borrow).create({
        book,
        user,
        borrow_date: now,
        due_date: dueDate,
        return_date: null,
        overdue: false,
      });
      await manager.getRepository(Borrow).save(borrow);

      // Kitobni available = false qilish
      book.available = false;
      await manager.getRepository(Book).save(book);

      // BookHistory yozuvi yaratish
      const history = manager.getRepository(BookHistory).create({
        user,
        book,
        action: HistoryAction.BORROW,
      });
      await manager.getRepository(BookHistory).save(history);

      // Result
      return {
        message: 'Borrow created and history saved successfully',
        borrow,
        history,
      };
    });
  }


  async returnBorrow(borrowId: string) {
    return this.dataSource.transaction(async (manager) => {
      //  Borrow yozuvini olish
      const borrow = await manager.getRepository(Borrow).findOne({
        where: { id: borrowId },
        relations: ['book', 'user'], // book va user relationlarini olish
      });
      if (!borrow) throw new NotFoundException('Borrow record not found');

      // Return date va overdue tekshirish
      const now = new Date();
      borrow.return_date = now;
      borrow.overdue = borrow.due_date < now;

      //  Kitobni available qilish
      borrow.book.available = true;

      //  Yozuvlarni saqlash
      await manager.getRepository(Borrow).save(borrow);
      await manager.getRepository(Book).save(borrow.book);

      // BookHistory yozuvi yaratish
      const history = manager.getRepository(BookHistory).create({
        user: borrow.user,
        book: borrow.book,
        action: HistoryAction.RETURN,
      });
      await manager.getRepository(BookHistory).save(history);

      return {
        message: 'Book returned successfully',
        borrow,
        history,
      };
    });
  }



  async findMyBorrows(user: User) {
    const borrows = await this.borrowRepo.find({
      where: { user: { id: user.id } },
      relations: ['book'], // kitob ma'lumotlarini ham olish uchun
      order: { borrow_date: 'DESC' },
    });

    return {
      message: 'Your borrows fetched successfully',
      borrows,
    };
  }





}
