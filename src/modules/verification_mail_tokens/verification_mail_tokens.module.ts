import { Module, forwardRef } from '@nestjs/common';
import { VerificationMailTokensService } from './verification_mail_tokens.service';
import { VerificationMailTokenRepository } from './repositories/verification_mail_tokens.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationMailToken } from './entities/verification_mail_token.entity';
import { VerificationMailTokensController } from './verifications_mail_tokens.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationMailToken]),
    VerificationMailTokensModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [VerificationMailTokensController],
  providers: [VerificationMailTokensService, VerificationMailTokenRepository],
  exports: [VerificationMailTokensService, VerificationMailTokenRepository],
})
export class VerificationMailTokensModule {}
