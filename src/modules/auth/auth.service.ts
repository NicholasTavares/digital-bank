import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { PayloadJWT } from './interfaces/payload-jwt.interface';
const redisClient = new Redis();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      account_id: user.account_id,
      jti: uuidv4(),
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async validateUser(email: string, password: string) {
    let user: User;
    try {
      user = await this.userService.findUserByEmailForAuth(email);
    } catch (error) {
      throw new UnauthorizedException('Email e/ou senha inválidos');
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email e/ou senha inválidos');
    }

    return user;
  }

  async addToBlacklist(token: string) {
    if (!token) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const decodedToken = this.jwtService.decode(token, {
      complete: true,
    }) as PayloadJWT;

    const tokenId = decodedToken.payload.jti;
    const expiration = decodedToken.payload.exp;

    await redisClient.set(tokenId, 'revoked', 'EXAT', expiration);
  }

  async isTokenRevoked(token: string) {
    const decodedToken = this.jwtService.decode(token, {
      complete: true,
    }) as PayloadJWT;
    const result = await redisClient.get(decodedToken.payload.jti);
    return result === 'revoked';
  }
}
