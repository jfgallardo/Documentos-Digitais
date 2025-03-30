import { Document } from '@core';

export type DashboardState = {
  documents: Document[] | null;
  loadingDocuments: boolean;
};

export type DashboardContextValue = {
  documents: Document[] | null;
  loadingDocuments: boolean;
  getDocuments?: (owner: string) => Promise<void>;
};
