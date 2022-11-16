import { Controller, Get, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get(':user_id')
  findOne(@Param('user_id') user_id: string) {
    return this.accountsService.findAccountByUser(user_id);
  }
}
