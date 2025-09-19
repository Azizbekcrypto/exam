import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
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
import { QueryDto } from './dto/query-filter.dto';
import { ILike } from 'typeorm';
import { AuthGuard } from 'src/common/guard/auth.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }


  // Yangi kitob qo‘shish (faqat admin va librarian)
  @SwagSuccessRes(
    'create book',
    201,
    'book created',
    201,
    'succes',
    bookData,
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'failed creating book',
    400,
    'username already exists',
  )
  @ApiBearerAuth()
  @Post()
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  ////
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.SUPER_ADMIN, UserRole.READER)
  @SwagSuccessRes(
    'Eng kop Oqilgan TOP KITOBlar',
    201,
    'Top Kitoblar',
    201,
    'succes',
    bookData,
  )
  @Get('top')
  async getTopBooks() {
    return this.bookService.findTopBooks();
  }


  @SwagSuccessRes(
    'Filtrlash',
    201,
    'Filters',
    201,
    'succes',
    bookData,
  )
  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.READER)
  @Get()
  async findAllWithFilter(@Query() queryDto: QueryDto) {
    const { query, search } = queryDto;

    const allowedFields = ['title', 'author', 'available', 'publishedYear'];
    if (search && !allowedFields.includes(search)) {
      throw new BadRequestException(
        `Search field "${search}" mavjud emas. Mavjud fields: ${allowedFields.join(', ')}`,
      );
    }

    let where: any = { available: true };

    if (search && query) {
      where = {
        ...where,
        [search]: ILike(`%${query}%`),
      };
    }

    return this.bookService.findAll({
      where,
      select: {
        id: true,
        title: true,
        author: true,
        published_year: true,
      },
      order: { created_at: 'DESC' },
    });
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
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.READER )
  findOne(@Param('id', ParseUUIDPipe) id: string) {
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
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  update(@Param('id',ParseUUIDPipe) id: string, @Body() dto: UpdateBookDto) {
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
  @Roles(UserRole.ADMIN, UserSRole.LIBRARIAN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookService.remove(id);
  }


}

