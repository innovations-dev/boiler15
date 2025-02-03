"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  title: string;
  description: string;
  onConfirmAction: () => void;
  isLoading?: boolean;
  variant?: "default" | "destructive";
  confirmText?: string;
  loadingText?: string;
}

export function ConfirmationDialog({
  open,
  onOpenChangeAction,
  title,
  description,
  onConfirmAction,
  isLoading,
  variant = "default",
  confirmText = "Confirm",
  loadingText = "Loading...",
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChangeAction(false)}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={onConfirmAction}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {loadingText}
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
