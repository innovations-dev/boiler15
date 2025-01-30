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
import { FloatingLabelInput } from "../floating-input";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="pt-2">
              <FormControl>
                <FloatingLabelInput
                  label="Email"
                  type="email"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Magic Link
        </Button>
      </form>
    </Form>
  );
}
