import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @Get('find')
  findOne(@Param('id') id: string) {
    return this.userService.findUser(id);
  }
}
