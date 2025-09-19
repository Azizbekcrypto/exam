import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminEntity } from 'src/core';
import type { AdminRepository } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';
import { UserRole } from 'src/common/enum/user-enum';
import { config } from 'src/config';
import { SignInDto } from './dto/signIn-admin.dto';
import { IPayload, ISuccessRes } from 'src/common/interface';
import { successRes } from 'src/infrastructure/response/successRes';
import { Response } from 'express';

@Injectable()
export class AdminService extends BaseService<
  CreateAdminDto,
  UpdateAdminDto,
  AdminEntity
> {
  constructor(
    @InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(adminRepo);
  }

  async onModuleInit() {
    try {
      const { fullName, password, username } = config.SuperAdmin;
      const existsSuperadmin = await this.adminRepo.findOne({
        where: { role: UserRole.SUPER_ADMIN },
      });
      const hashedPassword = await this.crypto.encrypt(password);
      if (!existsSuperadmin) {
        const superadmin = this.adminRepo.create({
          username: username,
          full_name: fullName,
          hashed_password: hashedPassword,
          role: UserRole.SUPER_ADMIN,
        });
        await this.adminRepo.save(superadmin);
        console.log('Super admin created successfully');
      }
    } catch (error) {
      throw new InternalServerErrorException('error in creating super admin');
    }
  }

  async create(createAdminDto: CreateAdminDto) {
    const { password, username, ...rest } = createAdminDto;
    const exist = await this.adminRepo.findOne({ where: { username } });
    if (exist) throw new HttpException('Username already exists', 400);


    const hashed_password = await this.crypto.encrypt(password);

    return super.create({
      ...rest, // full_name va boshqa maydonlar
      username, // dto ichidan kelgan username ni ham saqlaymiz
      hashed_password, // parol hashlangan holda saqlanadi
    } as any);
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const { username, password } = signInDto;


    const admin = await this.adminRepo.findOne({ where: { username } });
    if (!admin) throw new NotFoundException('Admin not found');
    const isMatchPassword = await this.crypto.decrypt(
      password,
      admin?.hashed_password as any,
    );
    if (!admin || !isMatchPassword)
      throw new BadRequestException('username or password incorect');

    const payload: IPayload = {
      id: admin.id,
      isActive: admin.is_active,
      role: admin.role,
    };
    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.accessToken(payload);
    await this.tokenService.writeCookie(res, 'adminToken', refreshToken, 30);

    return successRes({ token: accessToken });
  }

  async updateAdmin(
    id: string,
    dto: UpdateAdminDto,
    user: IPayload,
  ): Promise<ISuccessRes> {


    const { password, username, ...rest } = dto;

    let admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');

    // Username faqat o‘zgarganda tekshiriladi
    if (username && username !== admin.username) {
      const exists = await this.adminRepo.findOne({ where: { username } });
      if (exists) {
        throw new ConflictException('username already exists');
      }
    }

    // Update obyektini yig‘ish
    const updateData: Partial<AdminEntity> = {
      ...rest,
      ...(username && { username }),
    };

    // Parolni yangilash faqat SUPER_ADMIN bo‘lsa
    if (password && user.role === UserRole.SUPER_ADMIN) {
      updateData.hashed_password = await this.crypto.encrypt(password);
    }

    // Update qilish
    await this.adminRepo.update(id, updateData);

    // Yangilangan adminni qaytarish
    admin = await this.adminRepo.findOne({ where: { id } });
    return successRes(admin);
  }
}
