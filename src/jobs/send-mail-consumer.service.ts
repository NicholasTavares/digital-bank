import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

type JobEmailDataProps = {
  username: string;
  email: string;
};

@Processor('send-mail-verification-queue')
export class SendMailConsumerService {
  constructor(private readonly mailService: MailerService) {}
  @Process('send-mail-verification-job')
  async sendMailJob(job: Job<JobEmailDataProps>) {
    const { username, email } = job.data;

    await this.mailService.sendMail({
      to: email,
      from: 'Suport Digital Bank',
      subject: 'Email verification',
      text: `Hello, ${username}! Welcome to the Digital Bank. Please verify your email.`,
    });
  }
}
