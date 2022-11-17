import { Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { AccountRepository } from './repositories/account.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async findAccountByUser(user_id: string): Promise<Account> {
    const account = await this.accountRepository.findAccountByUser(user_id);

    return account;
  }

  async updateAccountBalance(
    account_id: string,
    balance: number,
  ): Promise<Account> {
    const account = await this.accountRepository.updateAccountBalance(
      account_id,
      balance,
    );

    return account;
  }
}
