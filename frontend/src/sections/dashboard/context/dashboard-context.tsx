'use client';

import { DashboardContextValue } from '@/actions/types/dashboard';
import { createContext } from 'react';

// ----------------------------------------------------------------------

export const DashboardContext = createContext<
  DashboardContextValue | undefined
>(undefined);

export const DashboardConsumer = DashboardContext.Consumer;
