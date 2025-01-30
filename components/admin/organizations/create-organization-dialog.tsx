"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import randomName from "@scaleway/random-name";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FloatingLabelInput } from "@/components/floating-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth/auth-client";
import { slugify } from "@/lib/utils";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

// Update the interface to match what the API expects
interface CreateOrganizationInput {
  name: string;
  slug: string;
}

export function CreateOrganizationDialog({
  open,
  onOpenChangeAction,
}: CreateOrganizationDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: randomName("t1").toLowerCase(),
      slug: slugify(randomName("t1")),
    },
    mode: "onChange",
  });

  // Watch name field and update slug
  const name = form.watch("name");
  useEffect(() => {
    if (name) {
      const lowerName = name.toLowerCase();
      const newSlug = slugify(lowerName);
      form.setValue("name", lowerName, { shouldValidate: true });
      form.setValue("slug", newSlug, { shouldValidate: true });
    }
  }, [name, form]);

  const { mutate: createOrganization, isPending } = useMutation({
    mutationFn: async (data: CreateOrganizationInput) => {
      console.log("Submitting data:", data);
      return authClient.organization.create({
        name: data.name,
        slug: data.slug,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization created successfully");
      onOpenChangeAction(false);
      form.reset();
    },
    onError: (error: Error) => {
      console.error("Creation failed:", error);
      toast.error(error.message || "Failed to create organization");
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChangeAction}
      aria-describedby="create-organization-dialog"
    >
      <DialogContent aria-describedby="create-organization-dialog">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => createOrganization(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1">
                        <FloatingLabelInput
                          label="Name"
                          {...field}
                          disabled={isPending}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={isPending}
                        onClick={() => {
                          const newName = randomName("t1");
                          form.setValue("name", newName);
                        }}
                        aria-label="Generate random name"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput label="Slug" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="relative z-50"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Organization
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Keep the validation schema simple
const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});
