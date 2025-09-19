import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Req } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { borrowData } from 'src/common/document';
import { SwagFailedRes, SwagSuccessRes } from 'src/common/decorator/swaggerSuccesRes-decorator';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { type barrowRepository, Borrow, User } from 'src/core';

@UseGuards(AuthGuard, RolesGuard)
@Controller('borrow')
@ApiBearerAuth()
export class BorrowController {
  constructor(
    private readonly borrowService: BorrowService
  ) { }



  @SwagSuccessRes(
    'Get my borrows',
    200,
    'borrows fetched successfully',
    200,
    'success',
    borrowData, // agar borrows uchun swagger schema bo‘lsa
  )
  @SwagFailedRes(
    401,
    'unauthorized',
    401,
    'unauthorized',
  )
  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN ,  UserRole.READER, 'ID') // foydalanuvchi kirgan bo‘lishi kerak
  @Get('my')
  myBorrows(@Req() req: any) {
    const user: User = req.user
    return this.borrowService.findMyBorrows(req);
  } 

  @SwagSuccessRes(
    'create Borrow with Book-history (Tranzaksiya) ',
    200,
    'admin created',
    201,
    'succes',
    borrowData,
  )
  @SwagFailedRes(
    409,
    'failed creating Transaction',
    400,
    'already exists',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.READER)
  @ApiBearerAuth()
  @Post("with-transaction")
  create(@Body() dto: CreateBorrowDto) {
    return this.borrowService.createBorrowWithHistory(dto);
  }

 

  @SwagSuccessRes(
    'borrow findAll',
    201,
    'success',
    201,
    'success',
    { ...borrowData },
  )
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  findAll() {
    return this.borrowService.findAll();
  }

  @SwagSuccessRes(
    'Bitta borrow olish',
    201,
    'borrow   muvaffaqiyatli olindi',
    201,
    'success',
    { ...borrowData },
  )
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.borrowService.findOneById(id);
  }

  //  Borrow qaytarish
  @SwagSuccessRes(
    'Cancel borrowed book with Book-history (Transaction)',
    200,
    'book cancelled successfully',
    200,
    'success',
    borrowData,
  )
  @SwagFailedRes(
    404,
    'borrow record not found',
    400,
    'not found',
  )
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.SUPER_ADMIN, 'ID')
  @Patch(':id/return')
  returnBook(@Param('id') borrowId: string) {
    return this.borrowService.returnBorrow(borrowId);
  }



  



  
}

