"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth/auth-client";
import { InvitationError } from "./invitation-error";

const getInvitation = (
  options: Parameters<typeof authClient.organization.getInvitation>[0]
): ReturnType<typeof authClient.organization.getInvitation> => {
  return authClient.organization.getInvitation(options);
};

const acceptInvitation = (
  options: Parameters<typeof authClient.organization.acceptInvitation>[0]
): ReturnType<typeof authClient.organization.acceptInvitation> => {
  return authClient.organization.acceptInvitation(options);
};

const rejectInvitation = (
  options: Parameters<typeof authClient.organization.rejectInvitation>[0]
): ReturnType<typeof authClient.organization.rejectInvitation> => {
  return authClient.organization.rejectInvitation(options);
};

export default function InvitationPage() {
  const params = useParams<{
    id: string;
  }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<{
    organizationName: string;
    organizationSlug: string;
    inviterEmail: string;
    id: string;
    status: "pending" | "accepted" | "rejected" | "canceled";
    email: string;
    expiresAt: Date;
    organizationId: string;
    role: string;
    inviterId: string;
  } | null>(null);
  const [invitationStatus, setInvitationStatus] = useState<
    "pending" | "accepted" | "rejected"
  >("pending");

  const handleAccept = async () => {
    const { error } = await acceptInvitation({
      invitationId: params.id,
    });

    if (error) {
      setError(error.message || "An error occurred");
    } else {
      setInvitationStatus("accepted");
      router.push(`/dashboard`);
      console.log({
        type: "organization_invitation_accepted",
        action: "Joined organization",
        details: `Accepted invitation to join ${invitation?.organizationName}`,
        entityType: "member",
        entityId: invitation?.id || "",
        organizationId: invitation?.organizationId || "",
        userId: session?.user.id || "",
      });
    }
  };

  const handleReject = async () => {
    const { error } = await rejectInvitation({
      invitationId: params.id,
    });
    if (error) {
      setError(error.message || "An error occurred");
    } else {
      setInvitationStatus("rejected");
    }
  };

  useEffect(() => {
    const { data, error } = getInvitation({
      query: {
        id: params.id,
      },
    });
    if (error) {
      setError(error.message || "An error occurred");
    } else {
      setInvitation(data);
    }
  }, [params.id]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      {invitation ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Organization Invitation</CardTitle>
            <CardDescription>
              You&apos;ve been invited to join an organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitationStatus === "pending" && (
              <div className="space-y-4">
                <p>
                  <strong>{invitation?.inviterEmail}</strong> has invited you to
                  join <strong>{invitation?.organizationName}</strong>.
                </p>
                <p>
                  This invitation was sent to{" "}
                  <strong>{invitation?.email}</strong>.
                </p>
              </div>
            )}
            {invitationStatus === "accepted" && (
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-center text-2xl font-bold">
                  Welcome to {invitation?.organizationName}!
                </h2>
                <p className="text-center">
                  You&apos;ve successfully joined the organization. We&apos;re
                  excited to have you on board!
                </p>
              </div>
            )}
            {invitationStatus === "rejected" && (
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <XIcon className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-center text-2xl font-bold">
                  Invitation Declined
                </h2>
                <p className="text-center">
                  You&lsquo;ve declined the invitation to join{" "}
                  {invitation?.organizationName}.
                </p>
              </div>
            )}
          </CardContent>
          {invitationStatus === "pending" && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReject}>
                Decline
              </Button>
              <Button onClick={handleAccept}>Accept Invitation</Button>
            </CardFooter>
          )}
        </Card>
      ) : error ? (
        <InvitationError />
      ) : (
        <InvitationSkeleton />
      )}
    </div>
  );
}

function InvitationSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}
