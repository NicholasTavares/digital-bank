import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Saving } from '../savings/entities/saving.entity';

@Injectable()
export class InterestRateProducerService {
  constructor(
    @InjectQueue('interest-rate-queue') private readonly queue: Queue,
  ) {}

  async sendInterestRate(saving_ids: Saving[]) {
    await this.queue.add('interest-rate', {
      saving_ids: saving_ids.map((sav) => sav.id),
    });
  }
}
