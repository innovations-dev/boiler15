"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthMode } from "@/hooks/auth/use-auth-mode";
import type { AuthMode } from "@/lib/auth/types";
import { MagicLinkForm } from "./magic-link-form";

interface AuthFormProps {
  mode?: AuthMode;
  className?: string;
}

export function AuthForm({ mode = "magic-link", className }: AuthFormProps) {
  const { mode: authMode, setMode: setAuthMode } = useAuthMode(mode);

  return (
    <div className={className}>
      <Tabs defaultValue={authMode} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="magic-link"
            onClick={() => setAuthMode("magic-link")}
          >
            Magic Link
          </TabsTrigger>
          <TabsTrigger
            value="password"
            onClick={() => setAuthMode("credentials")}
          >
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="magic-link">
          <MagicLinkForm />
        </TabsContent>
        <TabsContent value="password">
          <div className="text-center text-sm text-muted-foreground">
            Coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
