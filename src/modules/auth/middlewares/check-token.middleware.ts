import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class CheckTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const isLogged = await this.authService.isLogged(token);
      if (!isLogged) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
    }
    next();
  }
}
