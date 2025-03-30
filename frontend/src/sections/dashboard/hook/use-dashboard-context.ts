"use client";

import { useContext } from "react";
import { DashboardContext } from "../context";

// ----------------------------------------------------------------------

export function useDashboardContext() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboardContext: Context must be used inside DashboardProvider"
    );
  }

  return context;
}
