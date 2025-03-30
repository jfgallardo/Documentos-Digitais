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

interface JwtPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
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
  getProfile(@Request() req: RequestWithUser) {
    const user: JwtPayload = req.user;
    return {
      id: user.sub,
      username: user.username,
      issuedAt: new Date(user.iat * 1000),
      expiresAt: new Date(user.exp * 1000),
    };
  }
}
