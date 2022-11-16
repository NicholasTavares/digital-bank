import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(private dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }

  async findAccountByUser(user_id: string): Promise<Account> {
    const account = await this.findOne({
      where: {
        user_id,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account not found`);
    }

    return account;
  }
}
