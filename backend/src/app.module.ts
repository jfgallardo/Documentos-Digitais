import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { SignaturesModule } from './signatures/signatures.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    UsersModule,
    DocumentsModule,
    SignaturesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
