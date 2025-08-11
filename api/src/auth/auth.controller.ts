import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/signup.dto';
import { SUCCESS_MESSAGES } from 'src/utils/constants';
import {
  setAuthCookies,
  updateCookieWithAccessToken,
} from 'src/utils/cookie-helper';
import type { Request, Response } from 'express';
import { RefreshTokenGuard } from 'src/utils/guards/refresh-token.guard';
import { CustomRequest } from 'src/utils/guards/auth.guard';
import { CustomError } from 'src/utils/custom-error';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this._authService.login(dto);

    const tokens = await this._authService.generateToken(data);

    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      'user_AT',
      'user_RT',
    );

    return { message: SUCCESS_MESSAGES.LOGIN_SUCCESS, data };
  }

  @Post('signup')
  async signup(@Body() dto: RegisterDto) {
    console.log('fdasfafafda', dto);
    await this._authService.signup(dto);
    return { message: SUCCESS_MESSAGES.USER_CREATED };
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('in refresh token auth');
    const user = (req as CustomRequest).user
    const accessToken = await this._authService.accessToken(user);

    updateCookieWithAccessToken(res, accessToken, 'user_AT');
    return {message : SUCCESS_MESSAGES.REFRESH_TOKEN_SUCCESS}
  }
}
