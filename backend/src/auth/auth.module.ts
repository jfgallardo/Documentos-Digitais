import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { AuthProvider } from './auth.provider';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    DbModule,
    UsersModule,
    JwtModule.register({
      global: true,
      signOptions: { algorithm: 'HS256' },
    }),
  ],
  providers: [AuthProvider],
  controllers: [AuthController],
})
export class AuthModule {}
