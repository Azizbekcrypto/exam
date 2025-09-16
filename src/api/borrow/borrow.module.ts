import { Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from 'src/core';
import { UsersModule } from '../users/users.module';
import { BookModule } from '../book/book.module';

@Module({
  imports: [TypeOrmModule.forFeature([Borrow]), UsersModule, BookModule],
  controllers: [BorrowController],
  providers: [BorrowService],
})
export class BorrowModule {}
