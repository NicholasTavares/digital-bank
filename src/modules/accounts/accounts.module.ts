import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { AccountRepository } from './repositories/account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountsService, AccountRepository],
  controllers: [],
  exports: [AccountsService, AccountRepository],
})
export class AccountsModule {}
