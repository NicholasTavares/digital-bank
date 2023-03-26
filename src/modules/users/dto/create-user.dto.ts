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
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString()
  @MinLength(3, { message: 'Name should have 3 characters at least.' })
  @ApiProperty({
    example: 'Nicholas',
    description: 'Name of the user. Name should have 3 characters at least.',
  })
  readonly username: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail(
    {},
    {
      message: 'Invalid email.',
    },
  )
  @ApiProperty({
    example: 'nicholas@hogwarts.com',
    description: 'Email. A email should be valid.',
  })
  readonly email: string;

  @IsNotEmpty({ message: 'Birth date is required.' })
  @IsISO8601(
    { strict: true },
    {
      message: 'Invalid date.',
    },
  )
  @ApiProperty({
    example: '1932-06-21',
    description: 'Birth date. Users under 18 years old cannot register.',
  })
  readonly birth_date: Date;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString()
  @Matches(RegExHelper.password, { message: MessagesHelper.INVALID_PASSWORD })
  @ApiProperty({
    example: 'U$er321',
    description:
      'Password. The password must contain at least 6 characters, uppercase and lowercase letters, numbers, and special characters.',
  })
  readonly password: string;

  @IsNotEmpty({ message: 'Confirm password.' })
  @Match('password', { message: 'Password do not match.' })
  @ApiProperty({
    example: 'U$er321',
    description: 'Passwor confirmation. Shall match to password.',
  })
  readonly passwordConfirm: string;
}
