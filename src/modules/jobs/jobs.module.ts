import { Module, forwardRef } from '@nestjs/common';
import { SendMailProducerService } from './send-mail-producer.service';
import { SendMailConsumerService } from './send-mail-consumer.service';
import { BullModule } from '@nestjs/bull';
import { VerificationMailTokensModule } from '../verification_mail_tokens/verification_mail_tokens.module';
import { UsersModule } from '../users/users.module';
import { ResetPasswordTokenModule } from '../reset_password_token/reset_password_token.module';
import { SavingsModule } from '../savings/savings.module';
import { InterestRateProducerService } from './interest-rate-producer.service';
import { InterestRateConsumerService } from './interest-rate-consumer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail-queue',
    }),
    BullModule.registerQueue({
      name: 'interest-rate-queue',
    }),
    VerificationMailTokensModule,
    ResetPasswordTokenModule,
    forwardRef(() => SavingsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [
    SendMailProducerService,
    SendMailConsumerService,
    InterestRateProducerService,
    InterestRateConsumerService,
  ],
  exports: [
    SendMailProducerService,
    SendMailConsumerService,
    InterestRateProducerService,
    InterestRateConsumerService,
  ],
})
export class JobsModule {}
