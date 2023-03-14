import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SavingsService } from '../savings/savings.service';

type JobInterestRateProps = {
  saving_ids: number[];
};

@Processor('interest-rate-queue')
export class InterestRateConsumerService {
  constructor(private readonly savingsService: SavingsService) {}

  @Process('interest-rate')
  async consumeInterestRate(job: Job<JobInterestRateProps>) {
    const { saving_ids } = job.data;

    await this.savingsService.attInterestRate(saving_ids);
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, err: Error) {
    if (job.attemptsMade < 3) {
      return await job.retry();
    }

    await job.moveToFailed({ message: err.message });
  }
}
