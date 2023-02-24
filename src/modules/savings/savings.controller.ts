import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { SavingsService } from './savings.service';
import { AuthGuard } from '@nestjs/passport';
import { TransactionSavingValueDTO } from './dto/trasaction-saving-value.dto';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findMe(@Request() req: any) {
    return this.savingsService.findOne(req.user.account_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  depositValue(
    @Body() transactionSavingValueDTO: TransactionSavingValueDTO,
    @Request() req: any,
  ) {
    return this.savingsService.depositValue(
      transactionSavingValueDTO,
      req.user.account_id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/withdraw')
  withdrawValue(
    @Body() transactionSavingValueDTO: TransactionSavingValueDTO,
    @Request() req: any,
  ) {
    return this.savingsService.withdrawValue(
      transactionSavingValueDTO,
      req.user.account_id,
    );
  }
}
