import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateResetPasswordUserDTO {
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail(
    {},
    {
      message: 'Insira um email válido.',
    },
  )
  @ApiProperty({
    example: 'nicholas@hogwarts.com',
    description: 'Email. A email should be valid.',
  })
  readonly email: string;
}
