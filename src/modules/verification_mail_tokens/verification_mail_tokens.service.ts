import { Injectable } from '@nestjs/common';
import { VerificationMailToken } from './entities/verification_mail_token.entity';
import { VerificationMailTokenRepository } from './repositories/verification_mail_tokens.repository';
import * as crypto from 'crypto';

@Injectable()
export class VerificationMailTokensService {
  constructor(
    private readonly verificationMailTokenRepository: VerificationMailTokenRepository,
  ) {}

  async create(user_id: string): Promise<VerificationMailToken> {
    const hash = crypto.randomBytes(32).toString('hex');

    const verification_mail_token =
      await this.verificationMailTokenRepository.createToken(user_id, hash);

    return verification_mail_token;
  }

  async findOne(hash: string): Promise<VerificationMailToken> {
    const verification_mail_token =
      await this.verificationMailTokenRepository.findToken(hash);

    return verification_mail_token;
  }

  remove(id: number) {
    return `This action removes a #${id} verificationMailToken`;
  }
}
