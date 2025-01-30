"use client";

import { useMutation } from "@tanstack/react-query";
import { UserWithRole } from "better-auth/plugins";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getResetPasswordEmail } from "@/emails/reset-password";
import { authClient } from "@/lib/auth/auth-client";
import { sendResetPassword } from "@/lib/auth/emails";
import { sendEmailWithRetry } from "@/lib/email/services/send-email";
import { baseURL } from "@/lib/utils";

export function ProfileInfo() {
  const { data: session } = authClient.useSession();

  const { mutate: requestPasswordReset, isPending } = useMutation({
    mutationFn: async () => {
      // first, send email to user
      sendResetPassword({
        user: session?.user as UserWithRole,
        url: baseURL.toString(),
      });
    },
    onSuccess: () => {
      toast.success("Password reset email sent");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Manage your password and account security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Password</p>
          <p className="text-sm text-muted-foreground">Last changed: Never</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Two-Factor Authentication</p>
          <p className="text-sm text-muted-foreground">Not enabled</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2">
        <Button
          variant="outline"
          onClick={() => requestPasswordReset()}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Change Password
        </Button>
        <Button variant="outline" disabled>
          Enable Two-Factor Auth
        </Button>
      </CardFooter>
    </Card>
  );
}
