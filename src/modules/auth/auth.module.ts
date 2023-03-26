import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JobsModule } from '../jobs/jobs.module';
import { CheckTokenMiddleware } from './middlewares/check-token.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JobsModule,
    UsersModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, CheckTokenMiddleware],
  exports: [CheckTokenMiddleware, AuthService],
})
export class AuthModule {}
