import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/all')
  findAll() {
    return this.userService.findAllUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findOne(@Request() req: any) {
    return this.userService.findUser(req.user.id);
  }

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUser(createUserDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Body() updateUserDTO: UpdateUserDTO, @Request() req: any) {
    return this.userService.updateUser(req.user.id, updateUserDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  remove(@Request() req: any) {
    return this.userService.softRemoveUser(req.user.id);
  }
}
