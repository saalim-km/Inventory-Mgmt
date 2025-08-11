// src/common/guards/refresh-token.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { JwtService } from '../services/jwt.service';
import { CustomRequest } from './auth.guard';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(
        private _jwtService: JwtService
    ){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
    }

    try {
      const user = this._jwtService.verifyRefreshToken(token.refresh_token);
      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
      }

      (req as CustomRequest).user = {
        _id: user?._id,
        email: user?.email,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_EXPIRED);
    }
  }

  private extractToken(req: Request): { access_token: string; refresh_token: string } | null {
    const pathSegments = req.path.split('/');
    const privateRouteIndex = pathSegments.indexOf('');

    if (privateRouteIndex !== -1 && pathSegments[privateRouteIndex + 1]) {
      return {
        access_token: req.cookies[`user_AT`] || null,
        refresh_token: req.cookies[`user_RT`] || null,
      };
    }
    return null;
  }
}
