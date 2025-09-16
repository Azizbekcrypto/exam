import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthService } from '../auth/auth.seervice';
import { SwagFailedRes, SwagSuccessRes } from 'src/common/decorator/swaggerSuccesRes-decorator';
import { adminData } from 'src/common/document';
import { UserRole } from 'src/common/enum/user-enum';
import { Roles } from 'src/common/decorator/roles-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SignInDto } from './dto/signIn-admin.dto';
import type {Response} from 'express'
import { CookieGetter } from 'src/common/decorator/cookie-getter-decorator';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike } from 'typeorm';
import type { IPayload } from 'src/common/interface';
import { GetRequestUser } from 'src/common/decorator/get-request-user-decorator';


@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @SwagSuccessRes(
    'create admin',
    HttpStatus.CREATED,
    'admin created',
    201,
    'succes',
    adminData,
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'failed creating admin',
    400,
    'username already exists',
  )
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @SwagSuccessRes(
    'sign in admin',
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
    'username already exists',
  )
  @Roles('public')
  @Post('signin')
  signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signIn(signInDto, res);
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
    return this.authService.newToken(this.adminService.getRepository, token);
  }

  @SwagSuccessRes(
    'sign out in admin',
    HttpStatus.OK,
    'admin signed out successfully',
    200,
    'success',
    {adminData},
  )
  @SwagFailedRes(HttpStatus.UNAUTHORIZED, 'unauthorized', 400, 'unauthorized')
  @Post('signout')
  signOut(
    @CookieGetter('adminToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(
      this.adminService.getRepository,
      token,
      res,
      'adminToken',
    );
  }

  @SwagSuccessRes(
    'get all admins with pagination',
    HttpStatus.OK,
    'all admins get successfully with pagination',
    200,
    'succes',
    [{ ...adminData }],
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'error on get admins',
    500,
    'internal server error',
  )
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  @ApiBearerAuth()
  findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;

    const where = query
      ? { username: ILike(`%${query}%`), role: UserRole.ADMIN }
      : { role: UserRole.ADMIN };
    return this.adminService.findAllWithPagination({
      where,
      order: { created_at: 'DESC' },
      select: {
        id: true,
        username: true,
        is_active: true,
      },
      skip: page,
      take: limit,
    });
  }

  @SwagSuccessRes(
    'get all admins',
    HttpStatus.OK,
    'all admins get successfully',
    200,
    'succes',
    [{ ...adminData }],
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'error on get admins',
    500,
    'internal server error',
  )
  @Roles(UserRole.SUPER_ADMIN)
  @Get('all/admin')
  @ApiBearerAuth()
  findAll() {
    return this.adminService.findAll();
  }

  @SwagSuccessRes(
    'get all admins by admin',
    HttpStatus.OK,
    'all admins get by id successfully ',
    200,
    'succes',
    [{ ...adminData }],
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'error on get by id admins',
    500,
    'internal server error',
  )
  @Roles(UserRole.SUPER_ADMIN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findOneById(@Param('id') id: string) {
    return this.adminService.findOneById(id);
  }
  @SwagSuccessRes(
    'update admin successfully',
    HttpStatus.OK,
    'update admin successfully',
    200,
    'succes',
    [{ ...adminData }],
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'error on update admins',
    400,
    'username already exists',
  )
  @Roles(UserRole.SUPER_ADMIN, 'ID') /**kallani ishlating jigar */
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @GetRequestUser('user') user: IPayload,
  ) {
    return this.adminService.updateAdmin(id, updateAdminDto, user);
  }

  @SwagSuccessRes(
    'delete admin successfully',
    HttpStatus.OK,
    'delete admin successfully',
    200,
    'succes',
    [{ ...adminData }],
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    'error on update admins',
    404,
    'admin not found',
  )
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
