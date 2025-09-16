import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core';
import type { UserRepository } from 'src/core';
import { successRes } from 'src/infrastructure/response/successRes';

@Injectable()
export class UserService extends BaseService<CreateUserDto, UpdateUserDto, User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,
  ) {
    super(userRepo);
  }

  async create(dto: CreateUserDto) {
    const exist = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (exist) throw new ConflictException('email already exists');

    return super.create(dto);
  }

  async update(id: string, dto: UpdateUserDto) {
    let user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');

    if (dto.email && dto.email !== user.email) {
      const exists = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (exists) throw new ConflictException('email already exists');
    }

    await this.userRepo.update(id, dto);
    user = await this.userRepo.findOne({ where: { id } });
    return successRes(user);
  }


}