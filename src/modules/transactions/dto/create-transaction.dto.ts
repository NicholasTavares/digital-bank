import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionDTO {
  @IsNotEmpty({ message: 'Destinatário da transação é obrigatório!' })
  @IsString()
  readonly credited_user_id: string;

  @IsNotEmpty({ message: 'Valor da transação é obrigatório!' })
  @Transform(({ value }) => (value ? +value : undefined))
  readonly value: number;
}
