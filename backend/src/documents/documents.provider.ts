import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';
import { Document, StatusDocument } from '@core';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsProvider {
  constructor(private readonly prisma: PrismaProvider) {}

  async getAll(): Promise<Document[]> {
    return (await this.prisma.document.findMany({
      include: { owner: { select: { name: true } } },
    })) as Document[];
  }

  async getById(id: string): Promise<Document | null> {
    return (await this.prisma.document.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        ownerId: true,
        status: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })) as Document | null;
  }

  async create(
    document: Document,
    file: Express.Multer.File,
  ): Promise<Document> {
    const uploadDir = './uploads';

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, file.originalname);

    fs.writeFileSync(filePath, file.buffer);

    document.fileUrl = filePath;

    return (await this.prisma.document.create({
      data: document,
    })) as Document;
  }

  async update(id: string, document: Document): Promise<Document> {
    return (await this.prisma.document.update({
      where: { id },
      data: document,
    })) as Document;
  }

  async delete(id: string): Promise<Document> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { signature: true },
    });

    if (!document) {
      throw new Error('Documento no encontrado');
    }

    if (document.fileUrl && fs.existsSync(document.fileUrl)) {
      fs.unlinkSync(document.fileUrl);
    }

    if (document.signature) {
      if (
        document.signature.signatureUrl &&
        fs.existsSync(document.signature.signatureUrl)
      ) {
        fs.unlinkSync(document.signature.signatureUrl);
      }
      await this.prisma.signature.delete({
        where: { id: document.signature.id },
      });
    }

    return (await this.prisma.document.delete({
      where: { id },
    })) as Document;
  }

  async getDocumentsByStatus(status: StatusDocument): Promise<Document[]> {
    return (await this.prisma.document.findMany({
      where: { status },
    })) as Document[];
  }

  async getDocumentsByOwner(ownerId: string): Promise<Document[]> {
    return (await this.prisma.document.findMany({
      where: { ownerId },
      include: { owner: { select: { name: true } } },
    })) as Document[];
  }

  async downloadDocument(id: string): Promise<string> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document || !document.fileUrl) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const filePath = document.fileUrl;

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('El archivo no existe en el servidor');
    }

    return filePath;
  }
}
