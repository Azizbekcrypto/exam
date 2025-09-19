import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.test.service';
import { type barrowRepository, Borrow } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { SendDeadlineDto } from './dto/send-deadline.dto';
import { BorrowService } from '../borrow/borrow.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';

@UseGuards(AuthGuard, RolesGuard)
@Controller('notification.test')
export class NotificationTestController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly borrowService: BorrowService,
    @InjectRepository(Borrow) private readonly borrowRepo: barrowRepository,
  ) { }



  @ApiBearerAuth()
  @Post('cron/notify')
  @ApiBody({ type: SendDeadlineDto })
  async triggerNotify(@Body() body: SendDeadlineDto) {
    const { borrowId } = body;

    const borrow = await this.borrowRepo.findOne({
      where: { id: borrowId },
      relations: ['user', 'book'],
    });

    if (!borrow) {
      throw new NotFoundException('Borrow not found');
    }

    await this.notificationService.sendDueSoon(borrow.user, borrow);

    return {
      message: 'Manual trigger ✅ Email notification yuborildi',
      borrowId,
      reader: borrow.user.email,
    };
  }


  // Due_datedan kechiksa har kun Jarimani hisoblab yuboradi
  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post('cron/penalty')
  @ApiBody({ type: SendDeadlineDto })
  async triggerLateNotify(@Body() body: SendDeadlineDto) {
    const { borrowId } = body;

    const borrow = await this.borrowRepo.findOne({
      where: { id: borrowId },
      relations: ['user', 'book'],
    });

    if (!borrow) {
      throw new NotFoundException('Borrow not found');
    }

    const now = new Date();
    const daysLate =
      Math.floor((now.getTime() - borrow.due_date.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const penaltyAmount = daysLate * 15000; // 1 kunda 15 ming jarima

    // Email yuborish
    await this.notificationService.sendLateBorrow(borrow.user, borrow, penaltyAmount);

    return {
      message: 'Manual penalty trigger ✅ Email notification yuborildi',
      borrowId,
      userEmail: borrow.user.email,
      penaltyAmount,
    };
  }

}
