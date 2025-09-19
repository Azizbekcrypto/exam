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
  @Roles(UserRole.LIBRARIAN, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.bookHistoryService.findAll();
  }



}
