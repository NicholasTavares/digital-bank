import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/user')
  findOne(@Request() req: any) {
    return this.transactionsService.findTransactionByLoggedUser(req.user.id);
  }

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
