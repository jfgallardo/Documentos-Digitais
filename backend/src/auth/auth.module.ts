import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { AuthProvider } from './auth.provider';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    DbModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h', algorithm: 'HS256' },
    }),
  ],
  providers: [AuthProvider],
  controllers: [AuthController],
})
export class AuthModule {}
