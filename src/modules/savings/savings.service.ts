import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Saving } from './entities/saving.entity';
import { SavingRepository } from './repositories/saving.repository';
import { TransactionSavingValueDTO } from './dto/trasaction-saving-value.dto';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/entities/account.entity';
import { UsersService } from '../users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InterestRateProducerService } from '../jobs/interest-rate-producer.service';

@Injectable()
export class SavingsService {
  constructor(
    private readonly savingRepository: SavingRepository,
    private readonly usersService: UsersService,
    private readonly accountsRepository: AccountsService,
    private readonly interestRateProducerService: InterestRateProducerService,
  ) {}

  async findOne(account_id: string): Promise<Saving> {
    const user = await this.savingRepository.findSaving(account_id);

    return user;
  }

  async depositValue(
    { value }: TransactionSavingValueDTO,
    account_id: string,
  ): Promise<Saving> {
    const account = await this.accountsRepository.findOne(account_id);

    const roundedAndConvertedValueToCents = Math.round(value * 100);

    if (account.balance < roundedAndConvertedValueToCents) {
      throw new BadRequestException('Saldo insuficiente.');
    }

    const deposit = await this.savingRepository.depositValue(
      account.balance,
      account.id,
      roundedAndConvertedValueToCents,
    );

    return deposit;
  }

  async withdrawValue(
    { value }: TransactionSavingValueDTO,
    user_id: string,
    account_id: string,
  ): Promise<Account> {
    const roundedAndConvertedValueToCents = Math.round(value * 100);

    if (roundedAndConvertedValueToCents <= 0) {
      throw new BadRequestException('Valor inválido');
    }

    const user = await this.usersService.findOne(user_id);

    if (!user.verified_at) {
      throw new UnauthorizedException(
        'Conta não verificada. Verfique sua conta para sacar dinheiro da poupança ou transferir dinheiro para outras pessoas.',
      );
    }

    const saving = await this.savingRepository.findSaving(account_id);

    if (saving.balance < roundedAndConvertedValueToCents) {
      throw new BadRequestException('Saldo insuficiente.');
    }

    const account = await this.accountsRepository.findOne(account_id);

    const withdraw = await this.savingRepository.withdrawValue(
      saving.balance,
      saving.id,
      account.id,
      account.balance,
      roundedAndConvertedValueToCents,
    );

    return withdraw;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'interest-rate',
    timeZone: process.env.TZ,
  })
  async interestRate() {
    const limit = 5;
    let offset = 0;
    let savings = await this.savingRepository.getSavings(limit, offset);
    while (savings.length > 0) {
      await this.interestRateProducerService.sendInterestRate(savings);
      offset += 5;
      savings = await this.savingRepository.getSavings(limit, offset);
    }
  }

  async attInterestRate(saving_ids: number[]) {
    await this.savingRepository.incrementSaving(saving_ids);
  }
}
