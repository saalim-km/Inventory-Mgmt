// src/common/guards/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ERROR_MESSAGES, HTTP_STATUS } from 'src/utils/constants';
import { JwtService } from '../services/jwt.service';
import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  access_token: string;
  refresh_token: string;
}

export interface CustomRequest extends Request {
  user: CustomJwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const token = this.extractToken(req);
    console.log(token);
    if (!token) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
    }

    const user = this._jwtService.verifyAccessToken(
      token.access_token,
    ) as CustomJwtPayload;
    console.log('after veryfing accesss token',user);
    if (!user || !user._id) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
    }

    (req as CustomRequest).user = {
      ...user,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    };

    return true;
  }

  private extractToken(
    req: Request,
  ): { access_token: string; refresh_token: string } | null {
    return {
      access_token: req.cookies[`user_AT`] || null,
      refresh_token: req.cookies[`user_RT`] || null,
    };
  }
}
