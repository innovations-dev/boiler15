"use client";

import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessions } from "@/hooks/auth/use-sessions";

export function ProfileSessions() {
  const { data: sessions, isLoading } = useSessions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions across devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {sessions?.data?.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{session.userAgent}</p>
                  <p className="text-sm text-muted-foreground">
                    Last active: {format(new Date(session.createdAt), "PPP")}
                  </p>
                </div>
                {session.id === sessions?.data[0].id && (
                  <span className="text-xs text-muted-foreground">
                    Current Session
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
