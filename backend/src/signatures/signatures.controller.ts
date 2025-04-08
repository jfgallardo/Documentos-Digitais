import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SignaturesProvider } from './signatures.provider';
import { Signature } from '@core';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as mime from 'mime-types';

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

  @Get('download/:id')
  async download(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const filePath = await this.signaturesProvider.downloadPicture(id);
    const file = createReadStream(join(process.cwd(), filePath));

    const contentType: string =
      (mime.lookup(filePath) as string) || 'application/octet-stream';

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${filePath.split('/').pop()}"`,
    });

    return new StreamableFile(file);
  }
}
