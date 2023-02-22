import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { PaginationUsersDTO } from './dto/pagination-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/all')
  findAll(@Query() query: PaginationUsersDTO) {
    return this.userService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  findMe(@Request() req: any) {
    return this.userService.findMe(req.user.id);
  }

  @Get(':user_id')
  findOne(@Param('user_id') user_id: string) {
    return this.userService.findOne(user_id);
  }

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Body() updateUserDTO: UpdateUserDTO, @Request() req: any) {
    return this.userService.update(req.user.id, updateUserDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  remove(@Request() req: any) {
    return this.userService.remove(req.user.id);
  }
}
