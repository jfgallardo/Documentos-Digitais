import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@core';
import { jwtConstants } from './constants';
import { UsersProvider } from 'src/users/users.provider';

@Injectable()
export class AuthProvider {
  constructor(
    private readonly prisma: PrismaProvider,
    private jwtService: JwtService,
    private readonly usersProvider: UsersProvider,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await this.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.email };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '1h',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '7d',
    });

    await this.usersProvider.updateRefreshToken(user.id, refresh_token);

    return { access_token, refresh_token };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return (await this.prisma.user.findUnique({
      where: { email },
    })) as User | null;
  }

  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
  }> {
    try {
      const decoded: {
        sub: string;
        username: string;
        iat: number;
        exp: number;
      } = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || !user.refreshToken) throw new UnauthorizedException();

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isValid) throw new UnauthorizedException();

      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        { secret: jwtConstants.secret, expiresIn: '1h' },
      );

      return { access_token: newAccessToken };
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }

  private comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
