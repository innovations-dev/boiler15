"use client";

import { useQueryState } from "nuqs";

import { type AuthMode } from "@/lib/types";

export function useAuthMode(initialMode: AuthMode = "magic-link") {
  const [mode, setMode] = useQueryState<AuthMode>("mode", {
    defaultValue: initialMode,
    parse: (value): AuthMode => {
      if (
        value === "credentials" ||
        value === "register" ||
        value === "magic-link"
      ) {
        return value;
      }
      return "magic-link";
    },
  });

  return {
    mode,
    setMode,
  };
}
