import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ToNumber } from 'src/utils/ToNumber';

export class CreateTransactionDTO {
  @IsNotEmpty({ message: 'Destinatário da transação é obrigatório!' })
  @IsString()
  readonly credited_user_id: string;

  @IsNotEmpty({ message: 'Valor da transação é obrigatório!' })
  @Transform(({ value }) => (value ? ToNumber(value) : undefined))
  readonly value: number;
}
