import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationTestService } from './notification.test.service';

@Controller('notification.test')
export class NotificationTestController {
  constructor(private readonly notificationTestService: NotificationTestService) {}

}
