import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountsService: AccountsService,
  ) {}
  async createTransaction({
    user_id,
    value,
  }: CreateTransactionDTO): Promise<Transaction> {
    if (value <= 0) {
      throw new BadRequestException('Valor inválido');
    }

    const accountToBeDebited = await this.accountsService.findAccountByUser(
      '8b8af22a-ea63-40da-8ba6-af2ac7d887c9',
    );

    const accountToBeDebitedBalance = accountToBeDebited.balance * 1.0;

    if (accountToBeDebitedBalance < value) {
      throw new BadRequestException('Saldo insuficiente.');
    }

    const accountToBeCretited = await this.accountsService.findAccountByUser(
      user_id,
    );

    const accountToBeCretitedBalance = accountToBeCretited.balance * 1.0;

    if (accountToBeDebited.id === accountToBeCretited.id) {
      throw new BadRequestException('Conta de destino inválida.');
    }

    const transaction = await this.transactionRepository.createTransaction(
      accountToBeDebitedBalance,
      accountToBeCretitedBalance,
      accountToBeDebited.id,
      accountToBeCretited.id,
      value,
    );

    return transaction;
  }
}
