import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IPayload } from 'src/common/interface';
import { config } from 'src/config';
import { TokenService } from 'src/infrastructure/lib/token/Token';
import { successRes } from 'src/infrastructure/response/successRes';
import { Repository } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: TokenService) { }

  async newToken(repository: Repository<any>, token: string) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.Token.refresh_token_key,
    );
    if (!data) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const user = await repository.findOne({ where: { id: data?.id } });
    if (!user) {
      throw new ForbiddenException('Forbidden user');
    }
    const paylod: IPayload = {
      id: user.id,
      isActive: user.is_active,
      role: user.role,
    };
    const accessToken = await this.jwt.accessToken(paylod);
    return successRes({ token: accessToken });
  }

  async signOut(
    repository: Repository<any>,
    token: string,
    res: Response,
    tokenKey: string,
  ) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.Token.refresh_token_key,
    );
    if (!data) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const user = await repository.findOne({ where: { id: data?.id } });
    if (!user) {
      throw new ForbiddenException('Forbidden user');
    }
    res.clearCookie(tokenKey);
    return successRes({});
  }

 
} 

  
