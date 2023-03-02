import { Module } from '@nestjs/common';
import { ResetPasswordTokenService } from './reset_password_token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from './entities/reset_password_token.entity';
import { ResetPasswordTokenRepository } from './repositories/reset_password_token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPasswordToken])],
  controllers: [],
  providers: [ResetPasswordTokenService, ResetPasswordTokenRepository],
  exports: [ResetPasswordTokenService, ResetPasswordTokenRepository],
})
export class ResetPasswordTokenModule {}
