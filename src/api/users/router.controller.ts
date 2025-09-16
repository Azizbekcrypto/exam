import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { SwagFailedRes, SwagSuccessRes } from "src/common/decorator/swaggerSuccesRes-decorator";
import { userDataReader } from "src/common/document";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Roles } from "src/common/decorator/roles-decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserSRole } from "src/common/enum/users.enum";
import { UserRole } from "src/common/enum/user-enum";
import { QueryPaginationDto } from "src/common/dto/query-pagination.dto";
import { ILike } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

@UseGuards(AuthGuard, RolesGuard)
@Controller('readers')
export class ReaderController {
  constructor(private readonly userService: UserService) { }

  @SwagSuccessRes(
    'create reader',
    HttpStatus.CREATED,
    'reader created',
    201,
    'success',
    userDataReader,
  )
  @SwagSuccessRes('failed creating reader', HttpStatus.CONFLICT, 'email already exists', 400)
  @Roles(UserRole.ADMIN, UserSRole.LIBRARIAN)
  @Post()
  @ApiBearerAuth()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create({ ...dto, role: UserSRole.READER });
  }

  @SwagSuccessRes(
    'get all readers with pagination',
    HttpStatus.OK,
    'all readers fetched successfully',
    200,
    'success',
    [{ ...userDataReader }],
  )
  @SwagFailedRes(HttpStatus.CONFLICT, 'error on get readers', 500, 'internal server error')
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN)
  @Get()
  @ApiBearerAuth()
  findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;
    const where = query
      ? { full_name: ILike(`%${query}%`), role: UserSRole.READER }
      : { role: UserSRole.READER };
    return this.userService.findAllWithPagination({
      where,
      order: { createdAt: 'DESC' },
      skip: page,
      take: limit,
    });
  }


  @SwagSuccessRes(
    'get one reader by id',
    HttpStatus.OK,
    'reader fetched successfully',
    200,
    'success',
    userDataReader,
  )
  @SwagFailedRes(HttpStatus.NOT_FOUND, 'reader not found', 404, 'reader not found')
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.READER)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @SwagSuccessRes(
    'update reader successfully',
    HttpStatus.OK,
    'reader updated successfully',
    200,
    'success',
    userDataReader,
  )
  @SwagFailedRes(HttpStatus.CONFLICT, 'error on update reader', 400, 'validation error')
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.READER)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @SwagSuccessRes(
    'delete reader successfully',
    HttpStatus.OK,
    'reader deleted successfully',
    200,
    'success',
    {},
  )
  @SwagFailedRes(HttpStatus.NOT_FOUND, 'reader not found', 404, 'reader not found')
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}