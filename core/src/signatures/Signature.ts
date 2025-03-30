export default interface Signature {
  id: string;
  name: string;
  documentId: string;
  signerId: string;
  signatureUrl?: string;
  signedAt: Date;
}
