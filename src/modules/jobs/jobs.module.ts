import { Module } from '@nestjs/common';
import { SendMailProducerService } from './send-mail-producer.service';
import { SendMailConsumerService } from './send-mail-consumer.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail-verification-queue',
    }),
  ],
  providers: [SendMailProducerService, SendMailConsumerService],
  exports: [SendMailProducerService, SendMailConsumerService],
})
export class JobsModule {}
