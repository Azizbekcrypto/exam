import { Module } from '@nestjs/common';
import { AuthService } from './auth.seervice';
import { TokenService } from 'src/infrastructure/lib/token/Token';

@Module({
  providers: [AuthService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
