import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([Book])], // ⚡ Book entity repository import qilinadi
  providers: [BookService],
  controllers: [BookController],
  exports: [BookService],
})
export class BookModule {}
