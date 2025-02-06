"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { useAuthMode } from "@/hooks/auth/use-auth-mode";
import { authClient } from "@/lib/auth/auth-client";

const credentialsSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type CredentialsFormValues = z.infer<typeof credentialsSchema>;

export function CredentialsForm() {
  const { setMode } = useAuthMode();
  const form = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: CredentialsFormValues) => {
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      toast.success("Signed in successfully");
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    }
  };

  const isPending = form.formState.isSubmitting;

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
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 text-sm"
              onClick={() => setMode("register")}
            >
              Create one
            </Button>
          </p>
        </div>
      </form>
    </Form>
  );
}
