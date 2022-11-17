import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createTransactionDTO: CreateTransactionDTO,
    @Request() req: any,
  ) {
    return this.transactionsService.createTransaction(
      createTransactionDTO,
      req.user.id,
    );
  }
}
