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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    summary: 'Get transactions',
    description:
      'Returns an array of transactions of the logged-in user. Only need bearer token (jwt).',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  find(@Request() req: any) {
    return this.transactionsService.findTransactionsByLoggedUser(req.user.id);
  }

  @ApiOperation({
    summary: 'Get debited transactions',
    description:
      'Returns an array of debited transactions of the logged-in user. Only need bearer token (jwt).',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/debited')
  findDebited(@Request() req: any) {
    return this.transactionsService.findDebitedTransactionsByLoggedUser(
      req.user.id,
    );
  }

  @ApiOperation({
    summary: 'Get debited credited',
    description:
      'Returns an array of credited transactions of the logged-in user. Only need bearer token (jwt).',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/credited')
  findCredited(@Request() req: any) {
    return this.transactionsService.findCreditedTransactionsByLoggedUser(
      req.user.id,
    );
  }

  @ApiOperation({
    summary: 'Create transaction',
    description:
      'Create a transaction. The logged-in user can send money to other account. It requires verified email.',
  })
  @ApiBearerAuth()
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
