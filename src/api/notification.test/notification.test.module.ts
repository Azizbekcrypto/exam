import { Module } from '@nestjs/common';
import { NotificationTestService } from './notification.test.service';
import { NotificationTestController } from './notification.test.controller';

@Module({
  controllers: [NotificationTestController],
  providers: [NotificationTestService],
})
export class NotificationTestModule {}
