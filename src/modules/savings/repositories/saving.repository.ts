import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Saving } from '../entities/saving.entity';
import { Account } from '../../accounts/entities/account.entity';
import { SavingSummary } from '../interfaces';

@Injectable()
export class SavingRepository extends Repository<Saving> {
  constructor(private dataSource: DataSource) {
    super(Saving, dataSource.createEntityManager());
  }

  async findSaving(account_id: string): Promise<SavingSummary> {
    const saving = await this.findOne({
      where: {
        account_id,
      },
      select: ['id', 'balance', 'yield', 'total'],
    });

    if (!saving) {
      throw new NotFoundException(`Saving not found`);
    }

    return saving;
  }

  async depositValue(
    accountToBeDebitedBalance: number,
    accountToBeDebitedId: string,
    value: number,
  ): Promise<Saving> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let deposit: Saving;

    try {
      const accountToBeDebitedNewBalance = accountToBeDebitedBalance - value;

      const saving = await this.findSaving(accountToBeDebitedId);

      const accountToBeDebited = await queryRunner.manager.preload(Account, {
        id: accountToBeDebitedId,
        balance: accountToBeDebitedNewBalance,
      });

      deposit = await queryRunner.manager.findOne(Saving, {
        where: {
          id: saving.id,
        },
      });

      deposit.balance += value;
      deposit.total += value;

      await queryRunner.manager.save([accountToBeDebited, deposit]);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error completing deposit!');
    } finally {
      await queryRunner.release();
    }

    return deposit;
  }

  async withdrawValue(
    savingToBeDebitedId: string,
    savingToBeDebitedBalance: number,
    savingToBeDebitedYield: number,
    accountToBeCreditedId: string,
    accountToBeCreditedBalance: number,
    value: number,
  ): Promise<Account> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let withdraw: Account;

    try {
      let savingToBeDebitedNewBalance = savingToBeDebitedBalance;
      let savingToBeDebitedNewYield = savingToBeDebitedYield;

      if (value >= savingToBeDebitedYield) {
        savingToBeDebitedNewYield = 0;
        savingToBeDebitedNewBalance -= value - savingToBeDebitedYield;
      } else if (value < savingToBeDebitedYield) {
        savingToBeDebitedNewYield -= value;
      }

      const savingToBeDebited = await queryRunner.manager.preload(Saving, {
        id: savingToBeDebitedId,
        balance: savingToBeDebitedNewBalance,
        yield: savingToBeDebitedNewYield,
        total: savingToBeDebitedNewBalance + savingToBeDebitedNewYield,
      });

      withdraw = await queryRunner.manager.preload(Account, {
        id: accountToBeCreditedId,
        balance: accountToBeCreditedBalance + value,
      });

      await queryRunner.manager.save([savingToBeDebited, withdraw]);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Erro ao concluir deposito!');
    } finally {
      await queryRunner.release();
    }

    return withdraw;
  }

  async getSavings(limit: number, offset: number): Promise<Saving[]> {
    const savings = await this.find({
      select: ['id'],
      skip: offset,
      take: limit,
    });

    return savings;
  }

  async incrementSaving(savingIds: number[]) {
    const incrementSaving = 0.01;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savings = await queryRunner.manager.find(Saving, {
        where: {
          id: In(savingIds),
        },
        select: ['id', 'yield', 'balance', 'total'],
      });

      for (const saving of savings) {
        saving.yield += saving.balance * incrementSaving;
        saving.total = saving.balance + saving.yield;
      }

      await queryRunner.manager.save(savings);
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('ERROR', err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Increment cron yield error!');
    } finally {
      await queryRunner.release();
    }
  }
}
