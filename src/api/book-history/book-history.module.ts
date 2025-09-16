import { Module } from '@nestjs/common';
import { BookHistoryService } from './book-history.service';
import { BookHistoryController } from './book-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book, BookHistory } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([BookHistory, Book])], // ✅ BookHistory + Book
  controllers: [BookHistoryController], // ✅ BookHistory controller
  providers: [BookHistoryService], // ✅ BookHistory service
  exports: [BookHistoryService],
})
export class BookHistoryModule {}
