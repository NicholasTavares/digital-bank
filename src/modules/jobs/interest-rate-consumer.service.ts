import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SavingsService } from '../savings/savings.service';

type JobInterestRateProps = {
  saving_ids: number[];
};

@Processor('interest-rate-queue')
export class InterestRateConsumerService {
  constructor(private readonly savingsService: SavingsService) {}

  @Process('interest-rate')
  async sendMailTokenJob(job: Job<JobInterestRateProps>) {
    const { saving_ids } = job.data;

    await this.savingsService.attInterestRate(saving_ids);
  }
}
