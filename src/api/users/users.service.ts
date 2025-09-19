import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrow, User } from 'src/core';
import type { barrowRepository, UserRepository } from 'src/core';
import { successRes } from 'src/infrastructure/response/successRes';
import { IPayload, ISuccessRes } from 'src/common/interface';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';
import { SigninDto } from './dto/signIn-librarian.dto';
import type { Response } from 'express';
import { RegistrDto } from './dto/register-reader.dto';

@Injectable()
export class UserService extends BaseService<CreateUserDto, UpdateUserDto, User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,
    @InjectRepository(Borrow) private readonly borrowRepo: barrowRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(userRepo);
  }

  // Kutubxonachini Admin yaratadi
  async create(dto: CreateUserDto) {

    const { password, email } = dto
    const existEmail = await this.userRepo.findOne({
      where: { email },
    });
    if (existEmail) throw new ConflictException('email already exists');

    dto.password = await this.crypto.encrypt(password)


    return super.create(dto);
  }

  // O'quvchi registratsiya qiladi
  async register(dto: RegistrDto, res: Response): Promise<ISuccessRes> {
    let { password, email } = dto;
    const existEmail = await this.userRepo.findOne({ where: { email } });
    if (existEmail) {
      throw new ConflictException('email already exists')
    }

    dto.password = await this.crypto.encrypt(password);
    const reader = this.userRepo.create(dto);
    const newReader = await this.userRepo.save(reader);
    const payload: IPayload = {
      id: newReader.id,
      role: newReader.role,
    };

    const accessToken = await this.tokenService.accessToken(payload)
    const refreshtoken = await this.tokenService.refreshToken(payload);
    await this.tokenService.writeCookie(res, 'usertoken', refreshtoken, 30);

    return successRes({ reader: { newReader }, token: { accessToken } });

  }

  // User signIn
  async signIn(signInDto: SigninDto, res: Response) {
    const { email, password } = signInDto

    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatchPassword = await this.crypto.decrypt(
      password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new BadRequestException('username or password incorrect');
    }

    const payload: IPayload = {
      id: user.id,
      role: user.role,
    };

    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);

    await this.tokenService.writeCookie(res, 'usertoken', refreshToken, 30);

    return successRes({ token: accessToken });

  }


  // foydalanuvchi ma'lumotlarini yangilash
  async update(id: string, dto: UpdateUserDto): Promise<ISuccessRes> {
    const { email, password, full_name } = dto;

    // userni bazadan topamiz
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');

    // email update qilishdan oldin tekshirish
    if (email && email !== user.email) {
      const existEmail = await this.userRepo.findOne({ where: { email } });
      if (existEmail) {
        throw new ConflictException('email already exists');
      }
      user.email = email;
    }

    // ismni yangilash
    if (full_name) {
      user.full_name = full_name;
    }

    // password bo‘lsa, encrypt qilib yangilaymiz
    if (password) {
      user.password = await this.crypto.encrypt(password);
    }

    // saqlash
    await this.userRepo.save(user);

    return successRes(user);
  }


  // SignOut bilan New Tokenni Auth papkadan olamiz

  async findTopUsers() {
    return this.borrowRepo
      .createQueryBuilder('borrow')
      .leftJoin('borrow.user', 'user')
      .select('user.id', 'id')
      .addSelect('user.full_name', 'fullName')
      .addSelect('COUNT(borrow.id)', 'borrowCount')
      .groupBy('user.id')
      .addGroupBy('user.full_name')
      .orderBy('"borrowCount"', 'DESC')
      .limit(5)
      .getRawMany();
  }

}

