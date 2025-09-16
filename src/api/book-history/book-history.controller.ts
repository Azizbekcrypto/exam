import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookHistoryService } from './book-history.service';
import { CreateBookHistoryDto } from './dto/create-book-history.dto';
import { UpdateBookHistoryDto } from './dto/update-book-history.dto';
import { SwagFailedRes, SwagSuccessRes } from 'src/common/decorator/swaggerSuccesRes-decorator';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';
import { UserSRole } from 'src/common/enum/users.enum';
import { bookHistoryData } from 'src/common/document';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('book-histories')
export class BookHistoryController {
  constructor(private readonly bookHistoryService: BookHistoryService) { }

  //  ruchnoy tarix kiritish
  @SwagSuccessRes(
    'create history',
    201,
    'history created',
    201,
    'succes',
    bookHistoryData

  )
  @SwagFailedRes(
    409,
    'failed creating admin',
    400,
    'username already exists',
  )
  @Roles(UserRole.LIBRARIAN, UserRole.ADMIN, UserSRole.LIBRARIAN)
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateBookHistoryDto) {
    return this.bookHistoryService.create(dto);
  }

  // tarixlar
  @SwagSuccessRes(
    'get history',
    201,
    'history find',
    201,
    'succes',

  )
  @SwagFailedRes(
    409,
    'failed creating admin',
    400,
    'username already exists',
  )
  @Roles(UserRole.LIBRARIAN, UserRole.ADMIN)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.bookHistoryService.findAll();
  }

  @SwagSuccessRes(
    ' history',
    201,
    'history ',
    201,
    'succes',

  )
  @SwagFailedRes(
    409,
    ' history error',
    400,
    'history already exists',
  )
  @Roles(UserRole.LIBRARIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookHistoryService.findOneById(id);
  }

  @SwagSuccessRes(
    'update history',
    201,
    'history updated',
    201,
    'succes',

  )
  @SwagFailedRes(
    409,
    'failed updating admin',
    400,
    'history already exists',
  )
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBookHistoryDto,
  ) {
    return this.bookHistoryService.update(id, dto);
  }

 

  @SwagSuccessRes(
      'barcha book larni ochirish ',
      201,
      'booklar olindi',
      201,
      'succes',
    )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookHistoryService.remove(id);
  }



}
