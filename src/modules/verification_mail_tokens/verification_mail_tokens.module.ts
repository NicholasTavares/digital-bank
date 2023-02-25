import { Module } from '@nestjs/common';
import { VerificationMailTokensService } from './verification_mail_tokens.service';

@Module({
  controllers: [],
  providers: [VerificationMailTokensService],
})
export class VerificationMailTokensModule {}
