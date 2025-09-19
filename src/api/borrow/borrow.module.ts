import { forwardRef, Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from 'src/core';
import { UsersModule } from '../users/users.module';
import { BookModule } from '../book/book.module';
import { NotificationTestModule } from '../notification.test/notification.test.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrow]),
    UsersModule,
    BookModule,
    forwardRef(() => NotificationTestModule)],
  controllers: [BorrowController],
  providers: [BorrowService],
  exports: [BorrowService],
})
export class BorrowModule { }
