import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.test.service';
import { NotificationTestController } from './notification.test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from 'src/core';
import { BorrowModule } from '../borrow/borrow.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrow]), 
    forwardRef(() => BorrowModule), // ✅ forwardRef ishlatildi
  ],
  controllers: [NotificationTestController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationTestModule {}
