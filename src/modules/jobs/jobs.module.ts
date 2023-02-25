import { Module } from '@nestjs/common';
import { SendMailProducerService } from './send-mail-producer.service';
import { SendMailConsumerService } from './send-mail-consumer.service';
import { BullModule } from '@nestjs/bull';
import { VerificationMailTokenRepository } from '../verification_mail_tokens/repositories/verification_mail_tokens.repository';
import { VerificationMailTokensService } from '../verification_mail_tokens/verification_mail_tokens.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail-verification-queue',
    }),
    JobsModule,
  ],
  providers: [
    SendMailProducerService,
    SendMailConsumerService,
    VerificationMailTokensService,
    VerificationMailTokenRepository,
  ],
  exports: [SendMailProducerService, SendMailConsumerService],
})
export class JobsModule {}
