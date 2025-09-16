import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { AdminEntity, Book, BookHistory, Borrow, User } from 'src/core';
import { BookModule } from './book/book.module';
import { BookHistoryModule } from './book-history/book-history.module';
import { BorrowModule } from './borrow/borrow.module';
import { NotificationTestModule } from './notification.test/notification.test.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: config.DB.url,
      autoLoadEntities: true,
      entities: [User, Book, BookHistory, Borrow, AdminEntity],
      synchronize: true
    }), 
    JwtModule.register({
      global: true
    }),
    AdminModule,
    UsersModule,
    BookModule,
    BookHistoryModule,
    BorrowModule,
    NotificationTestModule],
  providers: [],
})
export class AppModule { }
