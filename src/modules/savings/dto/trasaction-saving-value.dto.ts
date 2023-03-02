import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class TransactionSavingValueDTO {
  @IsNotEmpty({ message: 'Valor do depósito é obrigatório!' })
  @Transform(({ value }) => (value ? +value : undefined))
  readonly value: number;
}
