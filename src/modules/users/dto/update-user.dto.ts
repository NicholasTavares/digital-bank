import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsISO8601, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO extends PartialType(
  OmitType(CreateUserDTO, ['password', 'passwordConfirm', 'email'] as const),
) {
  @IsString()
  @MinLength(3, { message: 'Name should have 3 characters at least.' })
  @IsOptional()
  @ApiProperty({
    example: 'Nicholas',
    description: 'Name of the user. Name should have 3 characters at least.',
  })
  readonly username?: string;

  @IsISO8601(
    { strict: true },
    {
      message: 'Invalid date.',
    },
  )
  @IsOptional()
  @ApiProperty({
    example: '1932-06-21',
    description: 'Birth date. Users under 18 years old cannot register.',
  })
  readonly birth_date?: Date;
}
