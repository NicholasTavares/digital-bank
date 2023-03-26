import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login',
    description: 'User wants to login. Only needs email and password.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'nicholas@hogwarts.com',
        },
        password: {
          type: 'string',
          example: 'U$er321',
        },
      },
      required: ['email', 'password'],
    },
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: 'Logout',
    description:
      'The logged-in user wants ends his session. Only need bearer token (jwt).',
  })
  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: any) {
    await this.authService.removeFromWhiteList(
      req.headers.authorization.split(' ')[1],
    );
  }
}
