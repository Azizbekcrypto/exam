// lib.module.ts
import { Module } from '@nestjs/common';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';

@Module({
  providers: [CryptoService, TokenService],
  exports: [CryptoService, TokenService],
})
export class LibModule {}
