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
}
