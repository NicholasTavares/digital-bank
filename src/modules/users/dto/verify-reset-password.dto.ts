import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { RegExHelper } from '../../../helpers/regex.helper';
import { Match } from '../../../utils/matchDecorator.util';
import { MessagesHelper } from '../../../helpers/messagesHelper.helper';

export class VerifyResetPasswordUserDTO {
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  @Matches(RegExHelper.password, { message: MessagesHelper.INVALID_PASSWORD })
  readonly password: string;

  @IsNotEmpty({ message: 'Confirme a senha.' })
  @Match('password', { message: 'As senhas não são iguais.' })
  readonly passwordConfirm: string;
}
