import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AuthModule } from './modules/auth/auth.module';
import { SavingsModule } from './modules/savings/savings.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { JobsModule } from './modules/jobs/jobs.module';
import { VerificationMailTokensModule } from './modules/verification_mail_tokens/verification_mail_tokens.module';
import { ResetPasswordTokenModule } from './modules/reset_password_token/reset_password_token.module';
import dbConfig from './config/db.config';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CheckTokenMiddleware } from './modules/auth/middlewares/check-token.middleware';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
      defaultJobOptions: {
        removeOnComplete: {
          age: 60,
        },
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    // TODO: migrations
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),
    MulterModule.register({
      storage: diskStorage({}),
      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        acceptFile: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return acceptFile(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        acceptFile(null, true);
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AccountsModule,
    TransactionsModule,
    AuthModule,
    SavingsModule,
    JobsModule,
    VerificationMailTokensModule,
    ResetPasswordTokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTokenMiddleware)
      .exclude({ path: 'auth/(.*)', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
