import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateResetPasswordTokenDTO {
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail(
    {},
    {
      message: 'Insira um email válido.',
    },
  )
  readonly email: string;
}
