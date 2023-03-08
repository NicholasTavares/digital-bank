import { Injectable } from '@nestjs/common';
import { VerificationMailToken } from './entities/verification_mail_token.entity';
import { VerificationMailTokenRepository } from './repositories/verification_mail_tokens.repository';
import * as crypto from 'crypto';

@Injectable()
export class VerificationMailTokensService {
  constructor(
    private readonly verificationMailTokenRepository: VerificationMailTokenRepository,
  ) {}

  async findOne(hash: string): Promise<VerificationMailToken> {
    const token = await this.verificationMailTokenRepository.findToken(hash);

    return token;
  }

  async create(user_id: string): Promise<VerificationMailToken> {
    const hash = crypto.randomBytes(32).toString('hex');

    const expires_at_24_hours = Date.now() + 24 + 60 * 60 * 1000;

    const verification_mail_token =
      await this.verificationMailTokenRepository.createToken(
        user_id,
        hash,
        expires_at_24_hours,
      );

    return verification_mail_token;
  }

  async delete(token_id: string) {
    await this.verificationMailTokenRepository.deleteToken(token_id);
  }

  async deleteMany(user_id: string) {
    await this.verificationMailTokenRepository.delete({
      user_id,
    });
  }
}
