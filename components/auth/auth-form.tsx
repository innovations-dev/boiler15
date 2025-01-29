"use client";

import { useState } from "react";

import { MagicLinkForm } from "./magic-link-form";

type AuthMode = "magic-link" | "credentials" | "register";

interface AuthFormProps {
  mode?: AuthMode;
  className?: string;
}

export function AuthForm({ mode = "magic-link", className }: AuthFormProps) {
  const [authMode, setAuthMode] = useState<AuthMode>(mode);

  return (
    <div className={className}>
      {authMode === "magic-link" && <MagicLinkForm />}
      {/* Add other form types here in the future */}
    </div>
  );
}
