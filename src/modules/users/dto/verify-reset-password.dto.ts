import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { RegExHelper } from '../../../helpers/regex.helper';
import { Match } from '../../../utils/matchDecorator.util';
import { MessagesHelper } from '../../../helpers/messagesHelper.helper';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetPasswordUserDTO {
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  @Matches(RegExHelper.password, { message: MessagesHelper.INVALID_PASSWORD })
  @ApiProperty({
    example: 'U$er321',
    description:
      'Password. The password must contain at least 6 characters, uppercase and lowercase letters, numbers, and special characters.',
  })
  readonly password: string;

  @IsNotEmpty({ message: 'Confirme a senha.' })
  @Match('password', { message: 'As senhas não são iguais.' })
  @ApiProperty({
    example: 'U$er321',
    description: 'Passwor confirmation. Shall match to password.',
  })
  readonly passwordConfirm: string;
}
