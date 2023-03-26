import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionDTO {
  @IsNotEmpty({ message: 'Destinatário da transação é obrigatório!' })
  @IsString()
  @ApiProperty({
    example: '0990e075-c9ad-4554-a761-838d22bf5fcb',
    description: 'User ID (uuid) of a existing user.',
  })
  readonly credited_user_id: string;

  @IsNotEmpty({ message: 'Valor da transação é obrigatório!' })
  @IsString()
  @Transform(({ value }) => (value ? +value : undefined))
  @ApiProperty({
    example: '8',
    description: 'Money the user wants to send.',
  })
  readonly value: number;
}
