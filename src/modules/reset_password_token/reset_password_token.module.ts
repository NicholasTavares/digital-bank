import { Module } from '@nestjs/common';
import { ResetPasswordTokenService } from './reset_password_token.service';
import { ResetPasswordTokenController } from './reset_password_token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from './entities/reset_password_token.entity';
import { UsersModule } from '../users/users.module';
import { ResetPasswordTokenRepository } from './repositories/reset_password_token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPasswordToken]), UsersModule],
  controllers: [ResetPasswordTokenController],
  providers: [ResetPasswordTokenService, ResetPasswordTokenRepository],
  exports: [ResetPasswordTokenService, ResetPasswordTokenRepository],
})
export class ResetPasswordTokenModule {}
