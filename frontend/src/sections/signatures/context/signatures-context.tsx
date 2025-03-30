'use client';

import { SignaturesContextValue } from '@/actions/types/signatures';
import { createContext } from 'react';

// ----------------------------------------------------------------------

export const SignaturesContext = createContext<
  SignaturesContextValue | undefined
>(undefined);

export const SignaturesConsumer = SignaturesContext.Consumer;
