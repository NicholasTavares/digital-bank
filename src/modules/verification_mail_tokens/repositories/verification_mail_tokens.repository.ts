import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { VerificationMailToken } from '../entities/verification_mail_token.entity';

@Injectable()
export class VerificationMailTokenRepository extends Repository<VerificationMailToken> {
  constructor(private dataSource: DataSource) {
    super(VerificationMailToken, dataSource.createEntityManager());
  }

  async findToken(hash: string): Promise<VerificationMailToken> {
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
    expires_at: number,
  ): Promise<VerificationMailToken> {
    const token = this.create({
      user_id,
      token: hash,
      expires_at,
    });

    await this.save(token);

    return token;
  }

  async deleteToken(hash_id: string) {
    await this.delete(hash_id);
  }
}
