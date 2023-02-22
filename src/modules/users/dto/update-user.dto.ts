import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends PartialType(
  OmitType(CreateUserDTO, ['password', 'passwordConfirm'] as const),
) {}
