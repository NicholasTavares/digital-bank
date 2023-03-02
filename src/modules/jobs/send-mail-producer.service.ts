import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

type SendMailTokenProps = {
  user_id: string;
  email: string;
  subject: string;
  endpoint: string;
  valid_time: string;
  type: 'VERIFY_EMAIL' | 'PASSWORD';
};

type SendMailProps = {
  username?: string;
  email: string;
  subject: string;
  text: string;
};

@Injectable()
export class SendMailProducerService {
  constructor(@InjectQueue('send-mail-queue') private readonly queue: Queue) {}

  async sendMailToken({
    user_id,
    email,
    subject,
    endpoint,
    valid_time,
    type,
  }: SendMailTokenProps) {
    await this.queue.add('send-mail-token', {
      user_id,
      email,
      subject,
      endpoint,
      valid_time,
      type,
    });
  }

  async sendMail({ email, subject, text }: SendMailProps) {
    await this.queue.add('send-mail', {
      email,
      subject,
      text,
    });
  }
}
