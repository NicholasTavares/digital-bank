import { Module } from '@nestjs/common';
import { VerificationMailTokensService } from './verification_mail_tokens.service';
import { VerificationMailTokenRepository } from './repositories/verification_mail_tokens.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationMailToken } from './entities/verification_mail_token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationMailToken])],
  controllers: [],
  providers: [VerificationMailTokensService, VerificationMailTokenRepository],
})
export class VerificationMailTokensModule {}
