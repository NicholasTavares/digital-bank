import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from './entities/saving.entity';
import { SavingRepository } from './repositories/saving.repository';
import { AccountsService } from '../accounts/accounts.service';
import { AccountRepository } from '../accounts/repositories/account.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Saving]), UsersModule],
  controllers: [SavingsController],
  providers: [
    SavingsService,
    SavingRepository,
    AccountsService,
    AccountRepository,
  ],
  exports: [AccountsService, AccountRepository],
})
export class SavingsModule {}
