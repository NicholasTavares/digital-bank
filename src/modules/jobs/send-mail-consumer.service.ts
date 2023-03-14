import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { VerificationMailTokensService } from '../verification_mail_tokens/verification_mail_tokens.service';
import { Inject, forwardRef } from '@nestjs/common';
import { ResetPasswordTokenService } from '../reset_password_token/reset_password_token.service';

type JobEmailTokenDataProps = {
  user_id: string;
  email: string;
  subject: string;
  endpoint: string;
  valid_time: string;
  type: 'VERIFY_EMAIL' | 'PASSWORD';
};

type JobEmailDataProps = {
  email: string;
  subject: string;
  text: string;
};

@Processor('send-mail-queue')
export class SendMailConsumerService {
  constructor(
    private readonly mailService: MailerService,
    @Inject(forwardRef(() => VerificationMailTokensService))
    private readonly verificationMailTokenService: VerificationMailTokensService,
    private readonly resetPasswordTokenService: ResetPasswordTokenService,
  ) {}

  @Process('send-mail-token')
  async sendMailTokenJob(job: Job<JobEmailTokenDataProps>) {
    const { user_id, email, subject, endpoint, valid_time, type } = job.data;

    const token =
      type === 'VERIFY_EMAIL'
        ? (await this.verificationMailTokenService.create(user_id)).token
        : (await this.resetPasswordTokenService.create(user_id)).token;

    const textKeyProporse =
      type === 'VERIFY_EMAIL' ? 'verify your email' : 'reset your password';

    await this.mailService.sendMail({
      to: email,
      from: 'Suport Digital Bank',
      subject: subject,
      text: `Please ${textKeyProporse} by clicking on the following link: ${process.env.DNS}:5001/${endpoint}/${token}.
      This token is valid for ${valid_time}`,
    });
  }

  @Process('send-mail')
  async sendMailJob(job: Job<JobEmailDataProps>) {
    const { email, subject, text } = job.data;
    await this.mailService.sendMail({
      to: email,
      from: 'Suport Digital Bank',
      subject: subject,
      text,
    });
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, err: Error) {
    if (job.attemptsMade < 3) {
      return await job.retry();
    }

    await job.moveToFailed({ message: err.message });
  }
}
