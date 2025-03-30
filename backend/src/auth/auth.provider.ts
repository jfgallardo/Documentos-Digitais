import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@core';

@Injectable()
export class AuthProvider {
  constructor(
    private readonly prisma: PrismaProvider,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await this.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return (await this.prisma.user.findUnique({
      where: { email },
    })) as User | null;
  }
}
