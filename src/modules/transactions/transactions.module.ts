import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AccountsService } from '../accounts/accounts.service';
import { AccountRepository } from '../accounts/repositories/account.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UsersModule],
  providers: [
    TransactionsService,
    TransactionRepository,
    AccountsService,
    AccountRepository,
  ],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
