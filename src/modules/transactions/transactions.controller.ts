import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDTO: CreateTransactionDTO) {
    return this.transactionsService.createTransaction(createTransactionDTO);
  }
}
