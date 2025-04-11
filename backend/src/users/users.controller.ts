import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PublicUser, UsersProvider } from './users.provider';
import { User } from '@core';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersProvider: UsersProvider) {}

  @Get()
  async getUsersByQuery(
    @Query() query: Record<string, any>,
  ): Promise<PublicUser[]> {
    return this.usersProvider.getUsersByQuery(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Body() id: string): Promise<PublicUser | null> {
    return this.usersProvider.getById(id);
  }

  @Post('create')
  async create(@Body() user: User): Promise<{ message: string }> {
    return this.usersProvider.create(user);
  }
}
