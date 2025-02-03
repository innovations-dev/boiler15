"use client";

import { format } from "date-fns";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessions } from "@/hooks/auth/use-sessions";

export function RecentActivity() {
  const { data: sessions, isLoading, error } = useSessions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load recent activity. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!sessions?.data?.length) {
    return (
      <p className="text-sm text-muted-foreground">No recent activity found.</p>
    );
  }

  return (
    <div className="space-y-8">
      {sessions?.data?.map((session) => (
        <div key={session.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              Session from {session.userAgent}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(session.createdAt), "PPP")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
