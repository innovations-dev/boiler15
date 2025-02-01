"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

import { OrganizationsListSkeleton } from "./organizations-list-skeleton";

const OrganizationsList = dynamic(
  () => import("./organizations-list").then((mod) => mod.OrganizationsList),
  { ssr: false }
);

export function OrganizationsListClient() {
  return (
    <Suspense fallback={<OrganizationsListSkeleton />}>
      <OrganizationsList />
    </Suspense>
  );
}
