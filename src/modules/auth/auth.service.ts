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
    const token_id = uuidv4();

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      account_id: user.account_id,
      jti: token_id,
    };

    const token = this.jwtService.sign(payload);

    const decodedToken = this.jwtService.decode(token, {
      complete: true,
    }) as PayloadJWT;

    await redisClient.set(
      `user:${user.id}:jwt:${token_id}`,
      'JWT_LOGIN',
      'EXAT',
      decodedToken.payload.exp,
    );

    return {
      token,
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

  async removeTokensFromWhiteList(user_id: string) {
    const keys = await redisClient.keys(`user:${user_id}:jwt:*`);

    if (keys.length === 0) {
      return;
    }

    await redisClient.del(keys);
  }

  async removeFromWhiteList(token: string) {
    if (!token) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const decodedToken = this.jwtService.decode(token, {
      complete: true,
    }) as PayloadJWT;

    await redisClient.del(
      `user:${decodedToken.payload.sub}:jwt:${decodedToken.payload.jti}`,
    );
  }

  async isLogged(token: string) {
    const decodedToken = this.jwtService.decode(token, {
      complete: true,
    }) as PayloadJWT;

    const result = await redisClient.get(
      `user:${decodedToken.payload.sub}:jwt:${decodedToken.payload.jti}`,
    );

    if (result) {
      return true;
    }

    return false;
  }
}
