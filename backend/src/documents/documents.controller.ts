import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  StreamableFile,
} from '@nestjs/common';
import { DocumentsProvider } from './documents.provider';
import { Document, StatusDocument } from '@core';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
  constructor(private readonly documentsProvider: DocumentsProvider) {}
  @Get()
  async getAll(): Promise<Document[]> {
    return this.documentsProvider.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Document | null> {
    return this.documentsProvider.getById(id);
  }

  @Get('status/:status')
  async getDocumentsByStatus(
    @Param('status') status: StatusDocument,
  ): Promise<Document[]> {
    return this.documentsProvider.getDocumentsByStatus(status);
  }

  @Get('owner/:ownerId')
  async getDocumentsByOwner(
    @Param('ownerId') ownerId: string,
  ): Promise<Document[]> {
    return this.documentsProvider.getDocumentsByOwner(ownerId);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() document: Document,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Document> {
    return this.documentsProvider.create(document, file);
  }

  @Get('update/:id')
  async update(
    @Param('id') id: string,
    @Body() document: Document,
  ): Promise<Document> {
    return this.documentsProvider.update(id, document);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<Document> {
    return this.documentsProvider.delete(id);
  }

  @Get('download/:id')
  async download(@Param('id') id: string): Promise<StreamableFile> {
    const filePath = await this.documentsProvider.downloadDocument(id);
    const file = createReadStream(join(process.cwd(), filePath));
    return new StreamableFile(file);
  }
}
