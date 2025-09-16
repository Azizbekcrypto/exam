import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { borrowData } from 'src/common/document';
import { SwagFailedRes, SwagSuccessRes } from 'src/common/decorator/swaggerSuccesRes-decorator';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';

@Controller('borrow')
@ApiBearerAuth()
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) { }

  @SwagSuccessRes(
    'create borrow',
    200,
    'admin created',
    201,
    'succes',
    borrowData,
  )
  @SwagFailedRes(
    409,
    'failed creating admin',
    400,
    'username already exists',
  )
  @Post(":id")
  create(@Body() createBorrowDto: CreateBorrowDto, @Param("bookId", ParseUUIDPipe) bookId: string) {
    return this.borrowService.createBorrow(createBorrowDto, bookId);
  }

  @SwagSuccessRes(
    'Tranzaksiya Borrow with History',
    201,
    'borrow va history muvaffaqiyatli yaratildi',
    201,
    'success',
    { ...borrowData },
  )
  @SwagFailedRes(
    400,
    'Order + Payment yaratishda xatolik',
    400,
    'Transaction failed',
  )
  @Post('with-payment')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, ) // faqat Customer to‘lov qilad ni
  @ApiBearerAuth()
  async createWithPayment(@Body() createOrderDto: CreateBorrowDto) {
    return this.borrowService.createBorrowWithHistory(createOrderDto);
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

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBorrowDto: UpdateBorrowDto,
  ) {
    return this.borrowService.updateBorrow(id, updateBorrowDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.borrowService.remove(id);
  }
}

