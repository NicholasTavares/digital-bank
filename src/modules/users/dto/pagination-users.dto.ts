import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class PaginationUsersDTO {
  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  order?: 'DESC' | 'ASC';
}
