import { DataSource, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async createTransaction(
    accountToBeDebitedBalance: number,
    accountToBeCretitedBalance: number,
    accountToBeDebitedId: string,
    accountToBeCretitedId: string,
    value: number,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let transaction: Transaction;

    // using queryRunner.manager entityManager because of typeorm transaction limitation
    // is not possible to use transaction with custom repositories and services from others modules

    try {
      const accountToBeDebitedNewBalance = accountToBeDebitedBalance - value;
      const accountToBeDebited = await queryRunner.manager.preload(Account, {
        id: accountToBeDebitedId,
        balance: accountToBeDebitedNewBalance,
      });

      const accountToBeCretitedNewBalance = accountToBeCretitedBalance + value;
      const accountToBeCretited = await queryRunner.manager.preload(Account, {
        id: accountToBeCretitedId,
        balance: accountToBeCretitedNewBalance,
      });

      await queryRunner.manager.save([accountToBeDebited, accountToBeCretited]);

      transaction = queryRunner.manager.create(Transaction, {
        debitedAccount: {
          id: 'df3e2793-4e3d-4777-8cd7-892b8a0c6906',
        },
        creditedAccount: {
          id: accountToBeCretitedId,
        },
        value,
      });

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Erro ao concluir transação!');
    } finally {
      await queryRunner.release();
    }

    return transaction;
  }
}
