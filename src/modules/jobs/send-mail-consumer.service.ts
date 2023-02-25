import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { VerificationMailTokensService } from '../verification_mail_tokens/verification_mail_tokens.service';

type JobEmailDataProps = {
  user_id: string;
  username: string;
  email: string;
};

@Processor('send-mail-verification-queue')
export class SendMailConsumerService {
  constructor(
    private readonly mailService: MailerService,
    private readonly verificationTokenService: VerificationMailTokensService,
  ) {}
  @Process('send-mail-verification-job')
  async sendMailJob(job: Job<JobEmailDataProps>) {
    const { user_id, username, email } = job.data;

    const token = await this.verificationTokenService.create(user_id);

    await this.mailService.sendMail({
      to: email,
      from: 'Suport Digital Bank',
      subject: 'Email verification',
      text: `Hello, ${username}! Welcome to the Digital Bank. Please verify your email by clicking on the following link: ${token.token}`,
    });
  }
}
