import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findUser(id);
  }

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUser(createUserDTO);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO) {
    return this.userService.updateUser(id, updateUserDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.softRemoveUser(id);
  }
}
