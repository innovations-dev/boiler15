"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES_STRING = ".jpg, .jpeg, .png, .webp";

interface ImageUploadProps {
  value?: string | null;
  onChangeAction: (value: string) => void;
  onRemoveAction: () => void;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChangeAction,
  onRemoveAction,
  disabled,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Image must be less than 5MB");
        return;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(
          "Invalid file type. Please upload a JPEG, PNG or WebP image"
        );
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          onChangeAction(base64String);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error converting image:", error);
        toast.error("Error processing image");
      }
    },
    [onChangeAction]
  );

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      await handleImageUpload(file);
    },
    [handleImageUpload]
  );

  return (
    <div
      className={cn(
        "relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 px-6 py-8 text-center transition-colors hover:bg-muted/20",
        isDragging && "border-primary/50 bg-muted/20",
        value && "border-primary/50",
        disabled && "cursor-not-allowed opacity-60"
      )}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={ACCEPTED_IMAGE_TYPES_STRING}
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void handleImageUpload(file);
          }
        }}
        disabled={disabled}
      />
      {value ? (
        <div className="relative">
          <div className="relative h-20 w-20">
            <Image
              src={value}
              alt="Upload preview"
              className="rounded-full object-cover"
              fill
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-muted/80 p-1 hover:bg-muted"
            onClick={onRemoveAction}
            disabled={disabled}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
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
  );
}
