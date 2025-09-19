import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { SwagFailedRes, SwagSuccessRes } from "src/common/decorator/swaggerSuccesRes-decorator";
import { userDataReader } from "src/common/document";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Roles } from "src/common/decorator/roles-decorator";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserSRole } from "src/common/enum/users.enum";
import { UserRole } from "src/common/enum/user-enum";
import { QueryPaginationDto } from "src/common/dto/query-pagination.dto";
import { ILike } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthService } from "../auth/auth.seervice";
import { RegistrDto } from "./dto/register-reader.dto";
import type { Response } from 'express'
import { SigninDto } from "./dto/signIn-librarian.dto";
import { CookieGetter } from "src/common/decorator/cookie-getter-decorator";

@UseGuards(AuthGuard, RolesGuard)
@Controller('readers')
export class ReaderController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService) { }


  // Reader Registration
  @SwagSuccessRes(
    "register new reader",
    HttpStatus.CREATED,
    "reader registered successfully",
    201,
    "success",
    userDataReader,
  )
  @SwagFailedRes(HttpStatus.CONFLICT, "email already exists", 409, "conflict")
  @Roles('public')
  @Post("register")
  async register(@Body() dto: RegistrDto, @Res({ passthrough: true }) res: Response) {
    return this.userService.register(dto, res);
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
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.SUPER_ADMIN)
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



  //

  @SwagFailedRes(
    HttpStatus.UNAUTHORIZED,
    'failed sign in',
    400,
    'email already exists',
  )
  @Roles('public')
  @Post('signin')
  signin(
    @Body() signInDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.signIn(signInDto, res);
  }


  @SwagSuccessRes(
    'get new new access token',
    HttpStatus.OK,
    'new access token get successfully',
    200,
    'success',
    {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI3ZDhlYWZhLTQ5YTYtNDg3MC1iZDQzLTgyOWFlZTQ5ZmM3ZSIsImlzQWN0aXZlIjp0cnVlLCJyb2xlIjoic3VwZXJBZG1pbiIsImlhdCI6MTc1NzYwMDk1MywiZXhwIjoxNzU3Njg3MzUzfQ._16AFV3nj-5Dj2P0dtljF8AkuamNoyqcw4YjGO67Ksc',
    },
  )
  @SwagFailedRes(
    HttpStatus.UNAUTHORIZED,
    'unauthorized',
    400,
    'refresh token expired',
  )
  @Post('token')
  newToken(@CookieGetter('readerToken') token: string) {
    return this.authService.newToken(this.userService.getRepository, token);
  }

  @SwagSuccessRes(
    'sign out in reader',
    HttpStatus.OK,
    'reader signed out successfully',
    200,
    'success',
    { userDataReader },
  )
  @SwagFailedRes(HttpStatus.UNAUTHORIZED, 'unauthorized', 400, 'unauthorized')
  @Post('signout')
  signOut(
    @CookieGetter('readerToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(
      this.userService.getRepository,
      token,
      res,
      'readerToken',
    );
  }

  @SwagSuccessRes(
    'get all readers',
    HttpStatus.OK,
    'all admins get successfully',
    200,
    'succes',
    [{ ...userDataReader }],
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'error on get admins',
    500,
    'internal server error',
  )
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get('all/admin')
  @ApiBearerAuth()
  findAll() {
    return this.userService.findAll();
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
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
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
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN, 'ID')
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  @ApiOperation({ summary: 'find all users with filter yani Top foydalanuvchilar' })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.LIBRARIAN)
  @Get('top-users')
  findTopUsers() {
    return this.userService.findTopUsers();
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
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOneById(id);
  }

}