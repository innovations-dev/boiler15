"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRequestPasswordReset } from "@/hooks/auth/use-request-password-reset";
import { useUsers } from "@/hooks/auth/use-users";

export function ProfileInfo() {
  const { data: users } = useUsers();
  const { mutate: requestPasswordReset, isPending } = useRequestPasswordReset();

  const handlePasswordReset = async () => {
    if (!users?.data?.users[0]) return;
    await requestPasswordReset(users.data.users[0].id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Security</CardTitle>
        <CardDescription>
          Manage your password and security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Two-Factor Authentication</p>
          <p className="text-sm text-muted-foreground">Not enabled</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2">
        <Button
          variant="outline"
          onClick={handlePasswordReset}
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
