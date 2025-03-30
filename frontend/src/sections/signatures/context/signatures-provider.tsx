'use client';

import { getSignaturesByOwner } from '@/actions/sign';
import { SignaturesState } from '@/actions/types/signatures';
import { useSetState } from '@/hooks/use-set-state';
import { useCallback, useMemo } from 'react';
import { SignaturesContext } from './signatures-context';

type Props = {
  children: React.ReactNode;
};

export function SignaturesProvider({ children }: Props) {
  const { state, setState, setField } = useSetState<SignaturesState>({
    signatures: null,
    loadingSignatures: true,
  });

  const getSignatures = useCallback(
    async (owner: string) => {
      try {
        setField('loadingSignatures', true);

        const res = await getSignaturesByOwner(owner);

        setField('signatures', res);

        setField('loadingSignatures', false);
      } catch (error) {
        console.error(error);

        setField('signatures', null);

        setField('loadingSignatures', false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setState],
  );

  const memoizedValue = useMemo(
    () => ({
      ...state,
      getSignatures,
    }),
    [getSignatures, state],
  );

  return (
    <SignaturesContext.Provider value={memoizedValue}>
      {children}
    </SignaturesContext.Provider>
  );
}
