import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Res, UseGuards } from "@nestjs/common";
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
import { SigninDto } from "./dto/signIn-librarian.dto";
import type { Response } from 'express'
import { AuthService } from "../auth/auth.seervice";
import { CookieGetter } from "src/common/decorator/cookie-getter-decorator";
import { QueryDto } from "../book/dto/query-filter.dto";


@UseGuards(AuthGuard, RolesGuard)
@Controller('librarians')
export class LibrarianController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,) { }

  @SwagSuccessRes(
    'create librarian',
    HttpStatus.CREATED,
    'librarian created',
    201,
    'success',
    [{ ...userDataLibrarian }],
  )
  @SwagFailedRes(HttpStatus.CONFLICT, 'failed creating librarian', 400, 'email already exists')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create({ ...dto, role: UserSRole.LIBRARIAN });
  }


  @SwagSuccessRes(
    'sign in Librarian',
    HttpStatus.OK,
    'admin sign in',
    200,
    'success',
    {
      statusCode: 200,
      message: 'success',
      data: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI3ZDhlYWZhLTQ5YTYtNDg3MC1iZDQzLTgyOWFlZTQ5ZmM3ZSIsImlzQWN0aXZlIjp0cnVlLCJyb2xlIjoic3VwZXJBZG1pbiIsImlhdCI6MTc1NzY3NjY4OCwiZXhwIjoxNzU3NzYzMDg4fQ.J62pRXCNrJvOjGqscB7UKcsoYWUu3unhKf9Oci5rt1Q',
      },
    },
  )
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
  newToken(@CookieGetter('adminToken') token: string) {
    return this.authService.newToken(this.userService.getRepository, token);
  }

  @SwagSuccessRes(
    'sign out in librarian',
    HttpStatus.OK,
    'admin signed out successfully',
    200,
    'success',
    { userDataLibrarian },
  )
  @SwagFailedRes(HttpStatus.UNAUTHORIZED, 'unauthorized', 400, 'unauthorized')
  @Post('signout')
  signOut(
    @CookieGetter('adminToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(
      this.userService.getRepository,
      token,
      res,
      'adminToken',
    );
  }

  @SwagSuccessRes(
    'get all librarian',
    HttpStatus.OK,
    'all admins get successfully',
    200,
    'succes',
    [{ ...userDataLibrarian }],
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
    'get one librarian by id',
    HttpStatus.OK,
    'librarian fetched successfully',
    200,
    'success',
    userDataLibrarian,
  )
  @SwagFailedRes(HttpStatus.NOT_FOUND, 'librarian not found', 404, 'librarian not found')
  @Roles(UserRole.ADMIN, 'ID', UserRole.SUPER_ADMIN)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOneById(id);
  }

  // yangilash
  @SwagSuccessRes(
    'update librarian successfully',
    HttpStatus.OK,
    'librarian updated successfully',
    200,
    'success',
    userDataLibrarian,
  )
  @SwagFailedRes(HttpStatus.CONFLICT, 'error on update librarian', 400, 'validation error')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) // faqat admin va superadmin yangilaydi
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }


  @SwagSuccessRes(
    'delete librarian successfully',
    HttpStatus.OK,
    'librarian deleted successfully',
    200,
    'success',
    {},
  )
  @SwagFailedRes(HttpStatus.NOT_FOUND, 'librarian not found', 404, 'librarian not found')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }


  ///


}