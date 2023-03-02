import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from './entities/saving.entity';
import { SavingRepository } from './repositories/saving.repository';
import { UsersModule } from '../users/users.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Saving]), UsersModule, AccountsModule],
  controllers: [SavingsController],
  providers: [SavingsService, SavingRepository],
  exports: [SavingsService, SavingRepository],
})
export class SavingsModule {}
