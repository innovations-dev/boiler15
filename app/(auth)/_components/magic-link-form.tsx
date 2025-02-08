"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { FloatingLabelInput } from "@/components/floating-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  useServerAction,
  type BetterAuthResponse,
} from "@/hooks/actions/use-server-action";
import { authClient } from "@/lib/auth/auth-client";
import { magicLinkSchema, type MagicLinkInput } from "@/lib/schemas/auth";

export function MagicLinkForm() {
  const form = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, isPending } = useServerAction<
    { status: boolean },
    MagicLinkInput
  >({
    action: async (data) =>
      authClient.signIn.magicLink({
        email: data.email,
        callbackURL: "/dashboard",
      }) as Promise<BetterAuthResponse<{ status: boolean }>>,
    schema: magicLinkSchema,
    context: "magicLink",
    successMessage:
      "Check your email for the magic link! If you don't see it, check your spam folder.",
    errorMessage: "Failed to send magic link",
    resetForm: () => form.reset(),
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in with Magic Link</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a magic link to sign
          in.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(execute)}
          className="space-y-4"
          aria-label="Magic link sign in form"
        >
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      label="Email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      aria-label="Email address"
                      aria-describedby="email-description"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage id="email-description" aria-live="polite" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={isPending}
              aria-label={
                isPending ? "Sending magic link..." : "Send magic link"
              }
            >
              {isPending ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Sending Link...</span>
                </>
              ) : (
                "Send Magic Link"
              )}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
