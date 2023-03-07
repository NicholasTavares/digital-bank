import { Module, forwardRef } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from './entities/saving.entity';
import { SavingRepository } from './repositories/saving.repository';
import { UsersModule } from '../users/users.module';
import { AccountsModule } from '../accounts/accounts.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Saving]),
    forwardRef(() => UsersModule),
    AccountsModule,
    forwardRef(() => JobsModule),
  ],
  controllers: [SavingsController],
  providers: [SavingsService, SavingRepository],
  exports: [SavingsService, SavingRepository],
})
export class SavingsModule {}
