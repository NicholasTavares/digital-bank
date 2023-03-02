import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { PaginationUsersDTO } from './dto/pagination-users.dto';
import { CreateResetPasswordUserDTO } from './dto/create-reset-password-user.dto';
import { Response } from 'express';
import { VerifyResetPasswordUserDTO } from './dto/verify-reset-password.dto';

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

  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordUserDTO: CreateResetPasswordUserDTO,
    @Res() res: Response,
  ) {
    await this.userService.resetPassword(resetPasswordUserDTO);
    return res.status(HttpStatus.CREATED).json({
      message: `Reset token sent to ${resetPasswordUserDTO.email}! Don't forget to check span folder!`,
    });
  }

  @Post('/reset-password/:token')
  async veryfyResetPassword(
    @Param('token') token: string,
    @Body() { password }: VerifyResetPasswordUserDTO,
  ) {
    return this.userService.verifyResetPassword(token, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  remove(@Request() req: any) {
    return this.userService.remove(req.user.id);
  }
}
