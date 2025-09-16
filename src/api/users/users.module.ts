import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow, User } from 'src/core';
import { ReaderController } from './router.controller';
import { LibrarianController } from './librarian.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Borrow])],
  controllers: [ReaderController, LibrarianController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
