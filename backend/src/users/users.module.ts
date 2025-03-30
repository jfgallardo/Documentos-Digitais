import { Module } from '@nestjs/common';
import { UsersProvider } from './users.provider';
import { DbModule } from 'src/db/db.module';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersProvider],
  imports: [DbModule],
  controllers: [UsersController],
})
export class UsersModule {}
