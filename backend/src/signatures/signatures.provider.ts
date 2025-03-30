import { Signature } from '@core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SignaturesProvider {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(
    signature: Signature,
    file: Express.Multer.File,
  ): Promise<Signature> {
    const uploadDir = './uploads/signatures';
    const idDocument = signature.documentId;
    const count = await this.prisma.signature.count();
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

    return newSignature;
  }

  async associateSignature(
    signatureId: string,
    documentId: string,
  ): Promise<Signature> {
    const signature = (await this.prisma.signature.findUnique({
      where: { id: signatureId },
    })) as Signature;

    if (!signature) {
      throw new NotFoundException('Signature not found');
    }

    await this.prisma.document.update({
      where: { id: documentId },
      data: { status: 'signed', signatureId },
    });

    return signature;
  }

  async getSignatureByUser(userId: string): Promise<Signature[]> {
    return (await this.prisma.signature.findMany({
      where: { signerId: userId },
      include: { documents: { select: { title: true, id: true } } },
    })) as Signature[];
  }
}
