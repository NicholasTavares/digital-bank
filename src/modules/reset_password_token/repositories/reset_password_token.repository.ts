import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ResetPasswordToken } from '../entities/reset_password_token.entity';

@Injectable()
export class ResetPasswordTokenRepository extends Repository<ResetPasswordToken> {
  constructor(private dataSource: DataSource) {
    super(ResetPasswordToken, dataSource.createEntityManager());
  }

  async findToken(hash: string): Promise<ResetPasswordToken> {
    const token = await this.findOne({
      where: {
        token: hash,
      },
    });

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    return token;
  }

  async createToken(
    user_id: string,
    hash: string,
  ): Promise<ResetPasswordToken> {
    const token = this.create({
      user_id,
      token: hash,
    });

    await this.save(token);

    return token;
  }

  async deleteToken(hash_id: string) {
    await this.delete(hash_id);
  }
}
