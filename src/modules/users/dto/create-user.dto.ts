import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { RegExHelper } from '../../../helpers/regex.helper';
import { MessagesHelper } from '../../../helpers/messagesHelper.helper';
import { Match } from '../../../utils/matchDecorator.util';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres.' })
  readonly username: string;

  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail(
    {},
    {
      message: 'Insira um email válido.',
    },
  )
  readonly email: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória.' })
  @IsISO8601(true, { message: 'Data inválida' })
  readonly birth_date: Date;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  @Matches(RegExHelper.password, { message: MessagesHelper.INVALID_PASSWORD })
  readonly password: string;

  @IsNotEmpty({ message: 'Confirme a senha.' })
  @Match('password', { message: 'As senhas não são iguais.' })
  readonly passwordConfirm: string;
}
