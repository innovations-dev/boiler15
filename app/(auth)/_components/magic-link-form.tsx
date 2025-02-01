"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMagicLink } from "@/hooks/auth/use-magic-link";
import { magicLinkSchema, type MagicLinkInput } from "@/lib/schemas/auth";
import { FloatingLabelInput } from "../../../components/floating-input";

export function MagicLinkForm() {
  const { mutate: sendMagicLink, isPending } = useMagicLink();

  const form = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: MagicLinkInput) {
    sendMagicLink(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label="Magic link sign in form"
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
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          aria-label={isPending ? "Sending magic link..." : "Send magic link"}
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
        <p className="text-center text-sm text-muted-foreground">
          We&apos;ll send a magic link to your email address to sign in.
        </p>
      </form>
    </Form>
  );
}
