"use client";

import { useSetState } from "@/hooks/use-set-state";
import { AuthState } from "../types";
import { useCallback, useMemo } from "react";
import { getProfile } from "@/actions/auth";
import { AuthContext } from "./auth-context";

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState, setField } = useSetState<AuthState>({
    user: null,
    authenticated: false,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const res = await getProfile();

      setField("user", res);
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setState]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      checkUserSession,
    }),
    [state, checkUserSession]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
