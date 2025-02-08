"use client";

import { useQueryState } from "nuqs";

import { type AuthMode } from "@/lib/types";

/**
 * A custom hook that manages authentication mode state through URL search parameters.
 * This hook allows switching between different authentication methods while maintaining
 * the selected mode in the URL, enabling deep linking and browser history support.
 *
 * @param {AuthMode} [initialMode="magic-link"] - The default authentication mode if none is specified in the URL
 * @returns {{ mode: AuthMode, setMode: (newMode: AuthMode | ((prev: AuthMode) => AuthMode)) => Promise<void> }}
 * An object containing the current mode and a function to update it
 *
 * @example
 * // Basic usage
 * function AuthForm() {
 *   const { mode, setMode } = useAuthMode();
 *
 *   return (
 *     <div>
 *       <button onClick={() => setMode("credentials")}>Use Password</button>
 *       <button onClick={() => setMode("magic-link")}>Use Magic Link</button>
 *       {mode === "credentials" && <CredentialsForm />}
 *       {mode === "magic-link" && <MagicLinkForm />}
 *     </div>
 *   );
 * }
 *
 * @example
 * // With custom initial mode
 * function RegistrationForm() {
 *   const { mode, setMode } = useAuthMode("register");
 *
 *   // ... form implementation
 * }
 *
 * @see {@link AuthMode} for available authentication modes
 */
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
