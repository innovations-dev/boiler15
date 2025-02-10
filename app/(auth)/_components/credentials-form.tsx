"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { FloatingLabelInput } from "@/components/floating-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  BetterAuthResponse,
  useServerAction,
} from "@/hooks/actions/use-server-action";
import { authClient } from "@/lib/auth/auth-client";

const credentialsSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type CredentialsFormValues = z.infer<typeof credentialsSchema>;

export function CredentialsForm() {
  const router = useRouter();
  const form = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, isPending } = useServerAction<
    { status: boolean },
    CredentialsFormValues
  >({
    action: async (data) =>
      authClient.signIn.email({
        email: data.email,
        password: data.password,
      }) as Promise<BetterAuthResponse<{ status: boolean }>>,
    schema: credentialsSchema,
    context: "credentials",
    successMessage: "Signed in successfully",
    errorMessage: "Invalid email or password",
    onSuccess: () => {
      router.push("/dashboard");
    },
    resetForm: () => form.reset(),
  });

  const onSubmit = (data: CredentialsFormValues) => execute(data);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label="Sign in form"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="pt-2">
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="pt-2">
              <FormControl>
                <FloatingLabelInput
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  aria-label="Password"
                  aria-describedby="password-description"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage id="password-description" aria-live="polite" />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            aria-label={isPending ? "Signing in..." : "Sign in"}
          >
            {isPending ? (
              <>
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
