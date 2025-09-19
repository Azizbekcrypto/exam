import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow, User } from 'src/core';
import { ReaderController } from './reader.controller';
import { LibrarianController } from './librarian.controller';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';
import { AuthService } from '../auth/auth.seervice';

@Module({
  imports: [TypeOrmModule.forFeature([User, Borrow])],
  controllers: [ReaderController, LibrarianController],
  providers: [UserService, CryptoService, TokenService, AuthService],
  exports: [UserService],
})
export class UsersModule {}
