import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SignaturesProvider } from './signatures.provider';
import { Signature } from '@core';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('signatures')
@UseGuards(AuthGuard)
export class SignaturesController {
  constructor(private readonly signaturesProvider: SignaturesProvider) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() signature: Signature,
    @UploadedFile() file: Express.Multer.File,
    @Query('signatureId') signatureId?: string,
  ): Promise<Signature> {
    if (signatureId) {
      return this.signaturesProvider.associateSignature(
        signatureId,
        signature.documentId,
      );
    } else {
      return this.signaturesProvider.create(signature, file);
    }
  }

  @Get('user/:id')
  async getSignatureByUser(@Param('id') id: string): Promise<Signature[]> {
    return this.signaturesProvider.getSignatureByUser(id);
  }
}
