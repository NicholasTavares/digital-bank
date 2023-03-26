import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginationUsersDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'nicholas@email.com',
    description:
      'Text can be a name or email. This is a param to filter existing users in database.',
  })
  text?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'DESC',
    description: 'Query param to list users in descending or ascending order.',
  })
  order?: 'DESC' | 'ASC';
}
