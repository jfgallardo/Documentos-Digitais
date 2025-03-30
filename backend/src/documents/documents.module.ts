import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { DocumentsProvider } from './documents.provider';
import { DocumentsController } from './documents.controller';

@Module({
  imports: [DbModule],
  providers: [DocumentsProvider],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
