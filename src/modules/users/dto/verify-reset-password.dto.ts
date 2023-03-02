import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { MessagesHelper } from 'src/helpers/messagesHelper.helper';
import { RegExHelper } from 'src/helpers/regex.helper';
import { Match } from 'src/utils/matchDecorator.util';

export class VerifyResetPasswordUserDTO {
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  @Matches(RegExHelper.password, { message: MessagesHelper.INVALID_PASSWORD })
  readonly password: string;

  @IsNotEmpty({ message: 'Confirme a senha.' })
  @Match('password', { message: 'As senhas não são iguais.' })
  readonly passwordConfirm: string;
}
