import { Injectable } from '@nestjs/common';
import { VerificationMailToken } from './entities/verification_mail_token.entity';
import { VerificationMailTokenRepository } from './repositories/verification_mail_tokens.repository';

@Injectable()
export class VerificationMailTokensService {
  constructor(
    private readonly verificationMailTokenRepository: VerificationMailTokenRepository,
  ) {}
  create(user_id: string, hash: string) {
    return 'This action adds a new verificationMailToken';
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
