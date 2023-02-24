import { BadRequestException, Injectable } from '@nestjs/common';
import { Saving } from './entities/saving.entity';
import { SavingRepository } from './repositories/saving.repository';
import { TransactionSavingValueDTO } from './dto/trasaction-saving-value.dto';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class SavingsService {
  constructor(
    private readonly savingRepository: SavingRepository,
    private readonly accountsRepository: AccountsService,
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
    account_id: string,
  ): Promise<Account> {
    const saving = await this.savingRepository.findSaving(account_id);
    const account = await this.accountsRepository.findOne(account_id);

    const roundedAndConvertedValueToCents = Math.round(value * 100);

    if (saving.balance < roundedAndConvertedValueToCents) {
      throw new BadRequestException('Saldo insuficiente.');
    }

    const withdraw = await this.savingRepository.withdrawValue(
      saving.balance,
      saving.id,
      account.id,
      account.balance,
      roundedAndConvertedValueToCents,
    );

    return withdraw;
  }
}
