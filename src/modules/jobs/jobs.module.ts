import { Module, forwardRef } from '@nestjs/common';
import { SendMailProducerService } from './send-mail-producer.service';
import { SendMailConsumerService } from './send-mail-consumer.service';
import { BullModule } from '@nestjs/bull';
import { VerificationMailTokensModule } from '../verification_mail_tokens/verification_mail_tokens.module';
import { UsersModule } from '../users/users.module';
import { ResetPasswordTokenModule } from '../reset_password_token/reset_password_token.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail-queue',
    }),
    VerificationMailTokensModule,
    ResetPasswordTokenModule,
    forwardRef(() => UsersModule),
  ],
  providers: [SendMailProducerService, SendMailConsumerService],
  exports: [SendMailProducerService, SendMailConsumerService],
})
export class JobsModule {}
