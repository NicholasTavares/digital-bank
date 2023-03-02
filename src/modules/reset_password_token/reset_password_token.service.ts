import { Injectable } from '@nestjs/common';
import { ResetPasswordTokenRepository } from './repositories/reset_password_token.repository';
import * as crypto from 'crypto';
import { ResetPasswordToken } from './entities/reset_password_token.entity';

@Injectable()
export class ResetPasswordTokenService {
  constructor(
    private readonly resetPasswordTokenRepository: ResetPasswordTokenRepository,
  ) {}

  async findOne(hash: string): Promise<ResetPasswordToken> {
    const token = await this.resetPasswordTokenRepository.findToken(hash);

    return token;
  }

  async create(user_id: string) {
    const hash = crypto.randomBytes(32).toString('hex');

    const expires_at = Date.now() + 10 * 60 * 1000;

    const reset_password_token =
      await this.resetPasswordTokenRepository.createToken(
        user_id,
        hash,
        expires_at,
      );

    return reset_password_token;
  }

  async delete(token_id: string) {
    await this.resetPasswordTokenRepository.deleteToken(token_id);
  }
}
