import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UserRole } from 'src/common/enum/user-enum';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserSRole } from 'src/common/enum/users.enum';
import { bookData } from 'src/common/document';
import { SwagFailedRes, SwagSuccessRes } from 'src/common/decorator/swaggerSuccesRes-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }


  // Yangi kitob qo‘shish (faqat admin va librarian)
  @SwagSuccessRes(
    'create admin',
    201,
    'admin created',
    201,
    'succes',
    bookData,
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'failed creating admin',
    400,
    'username already exists',
  )
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN)
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @SwagSuccessRes(  // filtrlash
    'barcha book larni olish ',
    201,
    'booklar olindi',
    201,
    'succes',
    bookData,
  )
  @Get()
  @ApiBearerAuth()
  findAll(@Query() query: any) {
    return this.bookService.findAllWithFilter(query);
  }

  //  Bitta kitob
  @SwagSuccessRes(
    'bitta book larni olish ',
    201,
    'book olindi',
    201,
    'succes',
    bookData,
  )
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.bookService.findOneById(id);
  }

  //  Yangilash
  @SwagSuccessRes(
    ' bookni yangilash ',
    201,
    'book yangilandi',
    201,
    'succes',
    bookData,
  )
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  //  O‘chirish
  @SwagSuccessRes(
    'bookni ochirish',
    201,
    'book ochdi',
    201,
    'succes',
    bookData,
  )
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserSRole.LIBRARIAN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }


}

