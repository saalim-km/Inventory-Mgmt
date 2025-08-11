import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import ms from 'ms';
import { Injectable } from '@nestjs/common';
import { TJwtPayload } from './types/service.types';

@Injectable()
export class JwtService {
  private accessSecret: Secret;
  private accessExpireIn: string;
  private refreshSecret: Secret;
  private refreshExpireIn: string;

  constructor() {
    this.accessSecret = process.env.ACCESS_SECRET_KEY || 'access-secret';
    this.accessExpireIn = process.env.ACCESS_EXPIRES_IN || '15m';
    this.refreshExpireIn = process.env.REFRESH_EXPIRES_IN || '1d';
    this.refreshSecret = process.env.REFRESH_SECRET_KEY || 'refresh-secret';
  }

  generateAccessToken(data: TJwtPayload): string {
    const accessToken = jwt.sign(data, this.accessSecret, {
      expiresIn: this.accessExpireIn as ms.StringValue,
    });
    return accessToken;
  }

  generateRefreshToken(data: TJwtPayload): string {
    const refreshToken = jwt.sign(data, this.refreshSecret, {
      expiresIn: this.refreshExpireIn as ms.StringValue,
    });

    return refreshToken;
  }

  verifyAccessToken(token: string): TJwtPayload | null {
    try {
      return jwt.verify(token, this.accessSecret) as TJwtPayload;
    } catch (error) {
      console.error('Access token verification failed:', error);
      return null;
    }
  }

  verifyRefreshToken(token: string): TJwtPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret) as TJwtPayload;
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  // Keep decode method for non-verification scenarios
  decodeRefreshToken(token: string): JwtPayload | null {
    try {
      const decode = jwt.decode(token) as JwtPayload;
      return decode;
    } catch (error) {
      console.error('Token decode failed:', error);
      return null;
    }
  }
}
