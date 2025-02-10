"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthMode } from "@/hooks/auth/use-auth-mode";
import type { AuthMode } from "@/lib/types";
import { CredentialsForm } from "./credentials-form";
import { MagicLinkForm } from "./magic-link-form";
import { RegisterForm } from "./register-form";

interface AuthFormProps {
  mode?: AuthMode;
  className?: string;
}

export function AuthForm({ mode = "magic-link", className }: AuthFormProps) {
  const { mode: authMode, setMode: setAuthMode } = useAuthMode(mode);

  return (
    <div className={className}>
      <Tabs value={authMode} className="w-full">
        {authMode !== "register" ? (
          // Sign In Tabs
          <>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="magic-link"
                onClick={() => setAuthMode("magic-link")}
              >
                Magic Link
              </TabsTrigger>
              <TabsTrigger
                value="credentials"
                onClick={() => setAuthMode("credentials")}
              >
                Password
              </TabsTrigger>
            </TabsList>
            <TabsContent value="magic-link">
              <MagicLinkForm />
            </TabsContent>
            <TabsContent value="credentials">
              <CredentialsForm />
            </TabsContent>
          </>
        ) : (
          // Register Form
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        )}
      </Tabs>

      <div className="text-center text-sm text-muted-foreground">
        {authMode === "register" ? (
          <>
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 text-primary underline-offset-4 hover:underline"
              onClick={() => setAuthMode("magic-link")}
            >
              Sign in
            </Button>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="p-0 text-primary underline-offset-4 hover:underline"
              onClick={() => setAuthMode("register")}
            >
              Create one
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
