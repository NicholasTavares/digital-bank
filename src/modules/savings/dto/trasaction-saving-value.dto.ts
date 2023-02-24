import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ToNumber } from 'src/utils/toNumber.util';

export class TransactionSavingValueDTO {
  @IsNotEmpty({ message: 'Valor do depósito é obrigatório!' })
  @Transform(({ value }) => (value ? ToNumber(value) : undefined))
  readonly value: number;
}
