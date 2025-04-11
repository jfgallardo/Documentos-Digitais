import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import { AuthGuard } from './auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from '@core';
import { Response } from 'express';

interface JwtPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
  email?: string;
}

interface RequestWithCookies extends ExpressRequest {
  cookies: { [key: string]: string };
}

interface RequestWithUser extends ExpressRequest {
  user: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authProvider: AuthProvider) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, string>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authProvider.signIn(
      signInDto.email,
      signInDto.password,
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }

  @Post('refresh')
  async refresh(@Req() req: RequestWithCookies, @Res() res: Response) {
    const refreshToken: string = req.cookies['refresh_token'];

    if (!refreshToken) throw new UnauthorizedException();

    const { access_token } = await this.authProvider.refreshToken(refreshToken);
    return res.json({ access_token });
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    const user: JwtPayload = req.user;
    let userByEmail: User | null = null;

    if (user.email) {
      userByEmail = await this.authProvider.getUserByEmail(user.email);
    }

    return {
      id: user.email ? userByEmail?.id : user.sub,
      username: user.username || user.email,
      issuedAt: new Date(user.iat * 1000),
      expiresAt: new Date(user.exp * 1000),
    };
  }
}
