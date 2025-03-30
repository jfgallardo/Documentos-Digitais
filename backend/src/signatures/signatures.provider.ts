import { Signature } from '@core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';

import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class SignaturesProvider {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(
    signature: Signature,
    file: Express.Multer.File,
  ): Promise<Signature> {
    const uploadDir = './uploads/signatures';
    const document = await this.prisma.document.findUnique({
      where: { id: signature.documentId },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    const idDocument = signature.documentId;
    const signerId = signature.signerId;
    const count = await this.prisma.signature.count({
      where: {
        signerId,
      },
    });
    const name = `Signature_${count + 1}`;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, file.originalname);

    fs.writeFileSync(filePath, file.buffer);

    signature.signatureUrl = filePath;

    const newSignature = (await this.prisma.signature.create({
      data: { ...signature, name },
    })) as Signature;

    await this.prisma.document.update({
      where: { id: idDocument },
      data: { status: 'signed', signatureId: newSignature.id },
    });

    await this.modifyPdf(document.fileUrl, newSignature.signatureUrl!);

    return newSignature;
  }

  async associateSignature(
    signatureId: string,
    documentId: string,
  ): Promise<Signature> {
    const signature = (await this.prisma.signature.findUnique({
      where: { id: signatureId },
    })) as Signature;

    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!signature || !document) {
      throw new NotFoundException('Signature or document not found');
    }

    await this.prisma.document.update({
      where: { id: documentId },
      data: { status: 'signed', signatureId },
    });

    await this.modifyPdf(document.fileUrl, signature.signatureUrl!);

    return signature;
  }

  async getSignatureByUser(userId: string): Promise<Signature[]> {
    return (await this.prisma.signature.findMany({
      where: { signerId: userId },
      include: { documents: { select: { title: true, id: true } } },
    })) as Signature[];
  }

  async modifyPdf(documentPath: string, signaturePath: string) {
    const existingPdfBytes: Buffer = fs.readFileSync(documentPath);
    const image = fs.readFileSync(signaturePath);
    const ext = this.getFileExtension(signaturePath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    if (ext === 'image/jpeg') {
      const jpgImage = await pdfDoc.embedJpg(image);
      const jpgDims = jpgImage.scale(0.5);
      const page = pdfDoc.addPage();
      page.drawImage(jpgImage, {
        x: page.getWidth() / 2 - jpgDims.width / 2,
        y: page.getHeight() / 2 - jpgDims.height / 2 + 250,
        width: jpgDims.width,
        height: jpgDims.height,
      });
      const pdfBytes = await pdfDoc.save();

      fs.writeFileSync(documentPath, pdfBytes);
    } else if (ext === 'image/png') {
      const pngImage = await pdfDoc.embedPng(image);
      const pngDims = pngImage.scale(0.5);
      const page = pdfDoc.addPage();
      page.drawImage(pngImage, {
        x: page.getWidth() / 2 - pngDims.width / 2,
        y: page.getHeight() / 2 - pngDims.height / 2 + 250,
        width: pngDims.width,
        height: pngDims.height,
      });
      const pdfBytes = await pdfDoc.save();

      fs.writeFileSync(documentPath, pdfBytes);
    } else {
      throw new Error('Unsupported file type');
    }
  }

  private getFileExtension(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.bmp':
        return 'image/bmp';
      case '.webp':
        return 'image/webp';
      default:
        return 'Desconocido';
    }
  }
}
