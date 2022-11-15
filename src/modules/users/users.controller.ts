import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
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

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUser(createUserDTO);
  }
}
