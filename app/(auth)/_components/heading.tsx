"use client";

import { useAuthMode } from "@/hooks/auth/use-auth-mode";

export function SignInHeading() {
  const { mode: authMode } = useAuthMode();

  return (
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {authMode === "register" ? "Welcome" : "Welcome back"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {authMode === "register"
          ? "Create your account to get started"
          : "Sign in to your account using your email"}
      </p>
    </div>
  );
}
