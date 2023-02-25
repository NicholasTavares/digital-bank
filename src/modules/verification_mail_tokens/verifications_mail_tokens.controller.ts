import { Controller, Param, Post } from '@nestjs/common';
import { VerificationMailTokensService } from './verification_mail_tokens.service';

@Controller('mail-verification')
export class VerificationMailTokensController {
  constructor(
    private readonly verificationMailTokensService: VerificationMailTokensService,
  ) {}

  @Post(':token')
  verifyMail(@Param('token') token: string) {
    return this.verificationMailTokensService.verifyMail(token);
  }
}
