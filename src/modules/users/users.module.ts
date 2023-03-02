import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JobsModule } from '../jobs/jobs.module';
import { ResetPasswordTokenModule } from '../reset_password_token/reset_password_token.module';
import { VerificationMailTokensModule } from '../verification_mail_tokens/verification_mail_tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => JobsModule),
    ResetPasswordTokenModule,
    VerificationMailTokensModule,
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
