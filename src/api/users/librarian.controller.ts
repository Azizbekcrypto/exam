import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { UserService } from "./users.service";
import { SwagFailedRes, SwagSuccessRes } from "src/common/decorator/swaggerSuccesRes-decorator";
import { userDataLibrarian } from "src/common/document";
import { UserRole } from "src/common/enum/user-enum";
import { Roles } from "src/common/decorator/roles-decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserSRole } from "src/common/enum/users.enum";
import { QueryPaginationDto } from "src/common/dto/query-pagination.dto";
import { ILike } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

@UseGuards(AuthGuard, RolesGuard)
@Controller('librarians')
export class LibrarianController {
  constructor(private readonly userService: UserService) { }

  // ✅ Librarian yaratish (faqat Admin)
  @SwagSuccessRes(
    'create librarian',
    HttpStatus.CREATED,
    'librarian created',
    201,
    'success',
    userDataLibrarian,
  )
  @SwagFailedRes(HttpStatus.CONFLICT, 'failed creating librarian', 400, 'email already exists')
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create({ ...dto, role: UserSRole.LIBRARIAN });
  }


  // Pagination bilan barcha librarianlarni olish
  @SwagSuccessRes(
    'get all librarians with pagination',
    HttpStatus.OK,
    'all librarians fetched successfully',
    200,
    'success',
    [{ ...userDataLibrarian }],
  )
  @SwagFailedRes(HttpStatus.CONFLICT, 'error on get librarians', 500, 'internal server error')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  @ApiBearerAuth()
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }





  //  Pagination bilan barcha librarianlarni olish
  @SwagSuccessRes(
    'get all librarians with pagination',
    HttpStatus.OK,
    'all librarians fetched successfully',
    200,
    'success',
    [{ ...userDataLibrarian }],
  )
  @SwagFailedRes(HttpStatus.CONFLICT, 'error on get librarians', 500, 'internal server error')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  @ApiBearerAuth()
  findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;
    const where = query
      ? { full_name: ILike(`%${query}%`), role: UserSRole.LIBRARIAN }
      : { role: UserSRole.LIBRARIAN };
    return this.userService.findAllWithPagination({
      where,
      order: { createdAt: 'DESC' },
      skip: page,
      take: limit,
    });
  }



  // Bitta librarianni olish
  @SwagSuccessRes(
    'get one librarian by id',
    HttpStatus.OK,
    'librarian fetched successfully',
    200,
    'success',
    userDataLibrarian,
  )
  @SwagFailedRes(HttpStatus.NOT_FOUND, 'librarian not found', 404, 'librarian not found')
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  // Librarian yangilash
  @SwagSuccessRes(
    'update librarian successfully',
    HttpStatus.OK,
    'librarian updated successfully',
    200,
    'success',
    userDataLibrarian,
  )
  @SwagFailedRes(HttpStatus.CONFLICT, 'error on update librarian', 400, 'validation error')
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  // Librarianni o‘chirish
  @SwagSuccessRes(
    'delete librarian successfully',
    HttpStatus.OK,
    'librarian deleted successfully',
    200,
    'success',
    {},
  )
  @SwagFailedRes(HttpStatus.NOT_FOUND, 'librarian not found', 404, 'librarian not found')
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}