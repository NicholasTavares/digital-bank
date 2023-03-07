import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Saving } from '../entities/saving.entity';
import { Account } from '../../accounts/entities/account.entity';

@Injectable()
export class SavingRepository extends Repository<Saving> {
  constructor(private dataSource: DataSource) {
    super(Saving, dataSource.createEntityManager());
  }

  async findSaving(account_id: string): Promise<Saving> {
    const saving = await this.findOne({
      where: {
        account_id,
      },
      select: ['id', 'balance', 'yield'],
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

      const newSavingBalance = saving.balance + value;

      const accountToBeDebited = await queryRunner.manager.preload(Account, {
        id: accountToBeDebitedId,
        balance: accountToBeDebitedNewBalance,
      });

      deposit = await queryRunner.manager.preload(Saving, {
        id: saving.id,
        balance: newSavingBalance,
      });

      await queryRunner.manager.save([accountToBeDebited, deposit]);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Erro ao concluir deposito!');
    } finally {
      await queryRunner.release();
    }

    return deposit;
  }

  async withdrawValue(
    savingToBeDebitedBalance: number,
    savingToBeDebitedId: string,
    accountToBeCreditedId: string,
    accountToBeCreditedBalance: number,
    value: number,
  ): Promise<Account> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let withdraw: Account;

    try {
      const savingToBeDebitedNewBalance = savingToBeDebitedBalance - value;

      const savingToBeDebited = await queryRunner.manager.preload(Saving, {
        id: savingToBeDebitedId,
        balance: savingToBeDebitedNewBalance,
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
}
