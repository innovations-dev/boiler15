"use client";

import { Github } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";

export function SocialAuthButtons() {
  const { mutate: signInWithGithub, isPending } = useBaseMutation({
    mutationFn: async () =>
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      }),
    onSuccess: () => {
      toast.success("Signed in with GitHub");
    },
    errorMessage: "Failed to sign in with GitHub",
    context: "github-sign-in",
  });

  return (
    <div className="grid gap-2">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isPending}
        onClick={() => signInWithGithub()}
        className="gap-2"
        aria-label={
          isPending ? "Signing in with GitHub..." : "Sign in with GitHub"
        }
      >
        {isPending ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : (
          <Github className="h-4 w-4" aria-hidden="true" />
        )}
        GitHub
      </Button>
    </div>
  );
}
