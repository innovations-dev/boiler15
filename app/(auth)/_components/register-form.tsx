"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";
import { FloatingLabelInput } from "../../../components/floating-input";

export function RegisterForm() {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: register, isPending } = useBaseMutation({
    mutationFn: async (data: RegisterInput) =>
      await authClient.signUp.email({
        ...data,
        callbackURL: "/dashboard",
      }),
    onSuccess: () => {
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
    },
    errorMessage: "Failed to register",
    context: "register",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => register(data))}
        className="space-y-4"
        aria-label="Registration form"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  label="Full Name"
                  type="text"
                  autoComplete="name"
                  autoFocus
                  aria-label="Full name"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  aria-label="Email address"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  aria-label="Password"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          aria-label={isPending ? "Creating account..." : "Create account"}
        >
          {isPending ? (
            <>
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              <span>Creating Account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
