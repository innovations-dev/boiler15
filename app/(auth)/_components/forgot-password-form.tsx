"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FloatingLabelInput } from "@/components/floating-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { API_ERROR_CODES } from "@/lib/schemas/api-types";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, isPending } = useServerAction<
    { status: boolean },
    ForgotPasswordInput
  >({
    action: (data) =>
      authClient.forgetPassword({
        email: data.email,
        redirectTo: "/reset-password",
      }) as Promise<BetterAuthResponse<{ status: boolean }>>,
    schema: forgotPasswordSchema,
    context: "forgotPassword",
    successMessage: "Password reset instructions sent to your email",
    errorMessage: "Failed to send reset instructions",
    resetForm: () => form.reset(),
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you instructions to reset your
          password.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(execute)} className="space-y-4">
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
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Instructions"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => window.history.back()}
              disabled={isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
