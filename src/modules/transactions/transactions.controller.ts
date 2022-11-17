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
  @Get('/')
  find(@Request() req: any) {
    return this.transactionsService.findTransactionsByLoggedUser(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/debited')
  findDebited(@Request() req: any) {
    return this.transactionsService.findDebitedTransactionsByLoggedUser(
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/credited')
  findCredited(@Request() req: any) {
    return this.transactionsService.findCreditedTransactionsByLoggedUser(
      req.user.id,
    );
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
