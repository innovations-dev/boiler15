"use client";

import { useAuthMode } from "@/hooks/auth/use-auth-mode";
import type { AuthMode } from "@/lib/types";
import { MagicLinkForm } from "./magic-link-form";

interface AuthFormProps {
  mode?: AuthMode;
  className?: string;
}

export function AuthForm({ mode = "magic-link", className }: AuthFormProps) {
  const { mode: authMode, setMode: setAuthMode } = useAuthMode(mode);

  return (
    <div className={className}>
      {authMode === "magic-link" && <MagicLinkForm />}
      {/* Add other form types here in the future */}
    </div>
  );
}
