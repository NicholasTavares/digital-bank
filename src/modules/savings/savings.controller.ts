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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Saving')
@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @ApiOperation({
    summary: 'Get my saving',
    description:
      'Returns informations about the saving of the logged-in user. Only need bearer token (jwt).',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findMe(@Request() req: any) {
    return this.savingsService.findOne(req.user.account_id);
  }

  @ApiOperation({
    summary: 'Deposit money',
    description:
      'Deposit money from the logged-in user account to the saving. Only need bearer token (jwt).',
  })
  @ApiBearerAuth()
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

  @ApiOperation({
    summary: 'Withdraw money',
    description:
      'Withdraw money from the logged-in saving user to the account. Only allow the email is verified. Need bearer token (jwt).',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/withdraw')
  withdrawValue(
    @Body() transactionSavingValueDTO: TransactionSavingValueDTO,
    @Request() req: any,
  ) {
    return this.savingsService.withdrawValue(
      transactionSavingValueDTO,
      req.user.id,
      req.user.account_id,
    );
  }
}
