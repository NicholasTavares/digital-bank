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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { PaginationUsersDTO } from './dto/pagination-users.dto';
import { CreateResetPasswordUserDTO } from './dto/create-reset-password-user.dto';
import { Response } from 'express';
import { VerifyResetPasswordUserDTO } from './dto/verify-reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  @ApiOperation({
    summary: 'Get users',
    description:
      'Returns an array of users filtered by email or username. If text is empty, returns all users.',
  })
  findAll(@Query() query: PaginationUsersDTO) {
    return this.userService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get me',
    description:
      'Returns informations about the logged-in user. Only need bearer token (jwt).',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  findMe(@Request() req: any) {
    return this.userService.findMe(req.user.id);
  }

  @ApiOperation({
    summary: 'Get user',
    description: 'Returns a user filtered by user ID.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':user_id')
  findOne(@Param('user_id') user_id: string) {
    return this.userService.findOne(user_id);
  }

  @ApiOperation({
    summary: 'Create user',
    description:
      'Create a user. Once a user is created, a email is sent to verification.',
  })
  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @ApiOperation({
    summary: 'Update user',
    description:
      'Updated logged-in user. Only need bearer token (jwt). All fields are optionals.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Body() updateUserDTO: UpdateUserDTO, @Request() req: any) {
    return this.userService.update(req.user.id, updateUserDTO);
  }

  @ApiOperation({
    summary: 'Update user avatar',
    description:
      'A user can have an avatar. When user already has an avatar, update the photo and delete the old one from S3 bucket. User should send a png, jpeg, or jpg with a limit size of 1MB.',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'))
  @Post('/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 }, // limit to 1MB
    }),
  )
  avatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.userService.avatar(
      req.user.id,
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }

  @ApiOperation({
    summary: 'Remove user avatar',
    description:
      'If the logged-in user wants to remove his avatar and be without a photo. Only need bearer token (jwt).',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/avatar')
  removeAvatar(@Request() req: any) {
    return this.userService.removeAvatar(req.user.id);
  }

  @ApiOperation({
    summary: 'Verify user email.',
    description: 'Validate token and verify email.',
  })
  @Post('/verify-mail/:token')
  async verifyMail(@Param('token') token: string) {
    return this.userService.verifyMail(token);
  }

  @ApiOperation({
    summary: 'Resend a email with a link to the logged-in user.',
    description:
      'If user wants to verify his email. A email is sent to the email of the logged-in user with a link to verify email',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/resend-verify-mail')
  async resendVerifyMail(@Request() req: any) {
    return await this.userService.resendVerifyMail(req.user.id, req.user.email);
  }

  @ApiOperation({
    summary: 'Send reset user password link.',
    description:
      'If user wants to reset his password. A email is sent to the user with a link to reset his password. Normally this endpoint will be consumed by users that forgot his password.',
  })
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

  @ApiOperation({
    summary: 'Reset user password.',
    description:
      'Validate reset user password. This endpoint receives a token sent to the user email and set the new password.',
  })
  @Post('/reset-password/:token')
  async veryfyResetPassword(
    @Param('token') token: string,
    @Body() { password }: VerifyResetPasswordUserDTO,
  ) {
    return this.userService.verifyResetPassword(token, password);
  }

  @ApiOperation({
    summary: 'Delete me',
    description:
      'The logged-in user wants to delete himself. This endpoint makes a soft delete. Only need bearer token (jwt).',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  remove(@Request() req: any) {
    return this.userService.remove(req.user.id);
  }
}
