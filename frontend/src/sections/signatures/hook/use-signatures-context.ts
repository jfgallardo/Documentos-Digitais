"use client";

import { useContext } from "react";
import { SignaturesContext } from "../context";

// ----------------------------------------------------------------------

export function useSignaturesContext() {
  const context = useContext(SignaturesContext);

  if (!context) {
    throw new Error(
      "useSignaturesContext: Context must be used inside SignaturesProvider"
    );
  }

  return context;
}
