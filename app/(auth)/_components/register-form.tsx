"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Target, Upload, X } from "lucide-react";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useServerAction,
  type BetterAuthResponse,
} from "@/hooks/actions/use-server-action";
import { useAuthMode } from "@/hooks/auth/use-auth-mode";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES_STRING = ".jpg, .jpeg, .png, .webp";

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
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "",
    },
  });

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Image must be less than 5MB");
        return;
      }

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(
          "Invalid file type. Please upload a JPEG, PNG or WebP image"
        );
        return;
      }

      try {
        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setImagePreview(base64String);
          form.setValue("image", base64String);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error converting image:", error);
        toast.error("Error processing image");
      }
    },
    [form]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    form.setValue("image", "");
  }, [form]);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Image must be less than 5MB");
        return;
      }

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(
          "Invalid file type. Please upload a JPEG, PNG or WebP image"
        );
        return;
      }

      try {
        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setImagePreview(base64String);
          form.setValue("image", base64String);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error converting image:", error);
        toast.error("Error processing image");
      }
    },
    [form]
  );

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
                <div
                  className={cn(
                    "relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 px-6 py-8 text-center transition-colors hover:bg-muted/20",
                    isDragging && "border-primary/50 bg-muted/20",
                    imagePreview && "border-primary/50"
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(e);
                      }
                    }}
                  />
                  {imagePreview ? (
                    <div className="relative h-20 w-20">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        className="rounded-full object-cover"
                        fill
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground/75">
                          Max file size: 5MB. Supported formats: JPEG, PNG, WebP
                        </p>
                      </div>
                    </div>
                  )}
                </div>
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
