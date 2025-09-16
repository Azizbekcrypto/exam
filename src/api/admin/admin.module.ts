import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/core';
import { JwtModule } from '@nestjs/jwt';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';
import { AuthService } from '../auth/auth.seervice';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.register({ global: true })
  ],
  controllers: [AdminController],
  providers: [AdminService, CryptoService, TokenService, AuthService],
})
export class AdminModule { }
