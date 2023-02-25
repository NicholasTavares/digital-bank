import { BadRequestException, Injectable } from '@nestjs/common';
import { VerificationMailToken } from './entities/verification_mail_token.entity';
import { VerificationMailTokenRepository } from './repositories/verification_mail_tokens.repository';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class VerificationMailTokensService {
  constructor(
    private readonly verificationMailTokenRepository: VerificationMailTokenRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(user_id: string): Promise<VerificationMailToken> {
    const hash = crypto.randomBytes(32).toString('hex');

    const verification_mail_token =
      await this.verificationMailTokenRepository.createToken(user_id, hash);

    return verification_mail_token;
  }

  async verifyMail(hash: string): Promise<VerificationMailToken> {
    const verification_mail_token =
      await this.verificationMailTokenRepository.findToken(hash);

    const today = new Date();
    const overOneDay = new Date(
      verification_mail_token.created_at.getUTCFullYear(),
      verification_mail_token.created_at.getUTCMonth(),
      verification_mail_token.created_at.getUTCDate(),
      verification_mail_token.created_at.getUTCHours() + 24,
    );

    if (overOneDay <= today) {
      await this.verificationMailTokenRepository.deleteToken(
        verification_mail_token.id,
      );
      // TODO: melhorar essa mensagem para mandar o usuario tentar novamente
      throw new BadRequestException('Token expirado!');
    }

    await this.usersService.updateVerifyUser(
      verification_mail_token.user_id,
      today,
    );

    await this.verificationMailTokenRepository.deleteToken(
      verification_mail_token.id,
    );

    return verification_mail_token;
  }
}
