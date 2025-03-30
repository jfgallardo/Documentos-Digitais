'use client';

import { getDocumentsByOwner } from '@/actions/dashboard';
import { DashboardState } from '@/actions/types/dashboard';
import { useSetState } from '@/hooks/use-set-state';
import { useCallback, useMemo } from 'react';
import { DashboardContext } from './dashboard-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function DashboardProvider({ children }: Props) {
  const { state, setState, setField } = useSetState<DashboardState>({
    documents: null,
    loadingDocuments: true,
  });

  const getDocuments = useCallback(
    async (owner: string) => {
      try {
        setField('loadingDocuments', true);

        const res = await getDocumentsByOwner(owner);

        setField('documents', res);

        setField('loadingDocuments', false);
      } catch (error) {
        console.error(error);

        setField('documents', null);

        setField('loadingDocuments', false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setState],
  );

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      ...state,
      getDocuments,
    }),
    [getDocuments, state],
  );

  return (
    <DashboardContext.Provider value={memoizedValue}>
      {children}
    </DashboardContext.Provider>
  );
}
