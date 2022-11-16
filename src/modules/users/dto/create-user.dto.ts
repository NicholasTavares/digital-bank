import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { MessagesHelper } from 'src/helpers/messagesHelper.helper';
import { RegExHelper } from 'src/helpers/regex.helper';
import { Match } from 'src/utils/MathDecorator.util';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres.' })
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @Matches(RegExHelper.password, { message: MessagesHelper.INVALID_PASSWORD })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'As senhas não são iguais.' })
  readonly passwordConfirm: string;
}
