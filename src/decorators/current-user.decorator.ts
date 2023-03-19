import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestCurrentUser } from '../modules/auth/interfaces/current-user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestCurrentUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
