import { Module } from '@nestjs/common';
import { VerificationMailTokensService } from './verification_mail_tokens.service';
import { VerificationMailTokenRepository } from './repositories/verification_mail_tokens.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationMailToken } from './entities/verification_mail_token.entity';
import { VerificationMailTokensController } from './verifications_mail_tokens.controller';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/repositories/user.repository';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationMailToken]), JobsModule],
  controllers: [VerificationMailTokensController],
  providers: [
    VerificationMailTokensService,
    VerificationMailTokenRepository,
    UsersService,
    UserRepository,
  ],
})
export class VerificationMailTokensModule {}
