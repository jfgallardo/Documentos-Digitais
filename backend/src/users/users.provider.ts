import { User } from '@core';
import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersProvider {
  constructor(private readonly prisma: PrismaProvider) {}

  async getAll(): Promise<User[]> {
    return (await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    })) as User[];
  }

  async getById(id: string): Promise<User | null> {
    return (await this.prisma.user.findUnique({
      where: { id },
    })) as User | null;
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

  async getUsersByQuery(filters: Prisma.UserWhereInput = {}): Promise<any[]> {
    return this.prisma.user.findMany({
      where: filters,
    });
  }

  private async hashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
