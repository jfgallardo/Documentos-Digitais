"use client";

import LoadingScreen from "@/components/loading-screen/loading-screen";
import { useBoolean } from "@/hooks/use-boolean";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const isChecking = useBoolean(true);

  if (isChecking) {
    return <LoadingScreen text="Verificando autenticação..." />;
  }

  return <>{children}</>;
}
