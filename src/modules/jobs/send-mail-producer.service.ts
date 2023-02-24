import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SendMailProducerService {
  constructor(
    @InjectQueue('send-mail-verification-queue') private readonly queue: Queue,
  ) {}

  async sendMail(username: string, email: string) {
    await this.queue.add('send-mail-verification-job', {
      username,
      email,
    });
  }
}
