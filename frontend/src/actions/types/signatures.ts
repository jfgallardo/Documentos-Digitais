import { Signature } from '@core';

export type SignaturesState = {
  signatures: Signature[] | null;
  loadingSignatures: boolean;
};

export type SignaturesContextValue = {
  signatures: Signature[] | null;
  loadingSignatures: boolean;
  getSignatures?: (owner: string) => Promise<void>;
};
