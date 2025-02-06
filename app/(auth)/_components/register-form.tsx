"use client";

import { useCallback, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Only include image if it exists
      const formData = {
        ...data,
        image: data.image || undefined, // Convert null to undefined if no image
        callbackURL: "/dashboard",
      };

      await authClient.signUp.email(formData);
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to register");
    }
  };

  const isPending = form.formState.isSubmitting;

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
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem className="pt-2">
              <div className="space-y-2">
                <FormLabel htmlFor="image" className="flex items-center gap-2">
                  Profile Image{" "}
                  <span className="text-sm text-muted-foreground">
                    (Optional)
                  </span>
                </FormLabel>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background shadow-sm hover:bg-muted"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <FormControl>
                    <Label
                      htmlFor="image-upload"
                      className={cn(
                        "group relative flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/25 px-6 py-4 text-center transition-all duration-300 ease-in-out hover:border-primary",
                        isDragging && "border-primary text-primary",
                        imagePreview && "translate-x-4 opacity-50"
                      )}
                    >
                      <input
                        type="file"
                        className="peer absolute inset-0 z-20 cursor-pointer opacity-0"
                        accept={ACCEPTED_IMAGE_TYPES_STRING}
                        disabled={isPending}
                        {...field}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={handleDrop}
                        onChange={(e) => {
                          handleImageUpload(e);
                          field.ref(e.target.value);
                        }}
                      />
                      {isDragging ? (
                        <div className="relative z-10 flex flex-col items-center justify-center gap-2 py-8 text-primary">
                          <Target
                            className="h-10 w-10 animate-pulse"
                            aria-hidden="true"
                          />
                          <p className="text-sm">Drop it here</p>
                        </div>
                      ) : (
                        <div className="relative z-10 flex flex-col items-center justify-center">
                          <Upload
                            className="h-6 w-6 text-muted-foreground group-hover:text-primary"
                            aria-hidden="true"
                          />
                          <div className="mt-2 space-y-1">
                            <p className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                              {imagePreview
                                ? "Replace image"
                                : "Upload an image"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Drag and drop or click to upload
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Max file size: 5MB
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Supported formats: JPG, PNG, WebP
                            </p>
                          </div>
                        </div>
                      )}
                    </Label>
                  </FormControl>
                </div>
              </div>
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
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 text-sm"
              onClick={() => setMode("credentials")}
            >
              Sign in
            </Button>
          </p>
        </div>
      </form>
    </Form>
  );
}
