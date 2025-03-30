import { StatusDocument } from './StatusDocument';

export default interface Document {
  id: string;
  title: string;
  fileUrl: string;
  ownerId: string;
  signatureId?: string;
  status: StatusDocument;
  createdAt: Date;
  updatedAt?: Date;
}
