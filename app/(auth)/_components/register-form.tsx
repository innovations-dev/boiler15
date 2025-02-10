"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { FloatingLabelInput } from "@/components/floating-input";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
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
import { useAuthMode } from "@/hooks/auth/use-auth-mode";
import { authClient } from "@/lib/auth/auth-client";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  image: z.string().optional().nullable(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { setMode } = useAuthMode();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "",
    },
  });

  const { execute, isPending } = useServerAction<
    { status: boolean },
    RegisterFormValues
  >({
    action: async (data) => {
      const formData = {
        ...data,
        image: data.image || undefined,
        callbackURL: "/dashboard",
      };

      return authClient.signUp.email(formData) as Promise<
        BetterAuthResponse<{ status: boolean }>
      >;
    },
    schema: registerSchema,
    context: "register",
    successMessage:
      "Registration successful! Please check your email to verify your account.",
    errorMessage: "Failed to register",
    resetForm: () => {
      form.reset();
      setImagePreview(null);
    },
  });

  const onSubmit = (data: RegisterFormValues) => execute(data);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label="Registration form"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="pt-2">
              <FormControl>
                <FloatingLabelInput
                  label="Name"
                  type="text"
                  autoComplete="name"
                  autoFocus
                  aria-label="Full name"
                  aria-describedby="name-description"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage id="name-description" aria-live="polite" />
            </FormItem>
          )}
        />

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
                  autoComplete="new-password"
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

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUpload
                  value={imagePreview}
                  onChangeAction={(base64String) => {
                    setImagePreview(base64String);
                    field.onChange(base64String);
                  }}
                  onRemoveAction={() => {
                    setImagePreview(null);
                    field.onChange("");
                  }}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
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
                <span>Creating account...</span>
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
