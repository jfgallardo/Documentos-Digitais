import { User } from '@core';
import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

export type PublicUser = Pick<
  User,
  'id' | 'name' | 'email' | 'image' | 'provider'
>;

@Injectable()
export class UsersProvider {
  constructor(private readonly prisma: PrismaProvider) {}

  async getAll(): Promise<Pick<User, 'id' | 'name' | 'email'>[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async getById(id: string): Promise<PublicUser | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        provider: true,
      },
    });
  }

  async create(user: User): Promise<{ message: string }> {
    const hashedPassword: string = await this.hashedPassword(user.password);

    await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    return { message: 'Usuário criado com sucesso!' };
  }

  async getUsersByQuery(
    filters: Prisma.UserWhereInput = {},
  ): Promise<PublicUser[]> {
    return await this.prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        provider: true,
      },
    });
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<{ message: string }> {
    const hashedToken: string = await this.hashedPassword(refreshToken);

    await this.prisma.user.update({
      where: { id },
      data: {
        refreshToken: hashedToken,
      },
    });

    return { message: 'Token atualizado com sucesso!' };
  }

  private async hashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
