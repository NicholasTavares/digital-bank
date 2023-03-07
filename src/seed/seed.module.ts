import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedsModule {}
