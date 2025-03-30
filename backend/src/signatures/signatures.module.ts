import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { SignaturesController } from './signatures.controller';
import { SignaturesProvider } from './signatures.provider';

@Module({
  imports: [DbModule],
  controllers: [SignaturesController],
  providers: [SignaturesProvider],
})
export class SignaturesModule {}
