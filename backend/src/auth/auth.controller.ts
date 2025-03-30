import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthProvider } from './auth.provider';
import { AuthGuard } from './auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from '@core';

interface JwtPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
  email?: string;
}

interface RequestWithUser extends ExpressRequest {
  user: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authProvider: AuthProvider) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authProvider.signIn(signInDto.email, signInDto.password);
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
