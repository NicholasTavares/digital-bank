import { Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { AccountRepository } from './repositories/account.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async findAccountByUser(user_id: string): Promise<Account> {
    const user = await this.accountRepository.findAccountByUser(user_id);

    return user;
  }
}
