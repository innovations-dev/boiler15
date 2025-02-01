"use client";

import { format } from "date-fns";

export function FormattedDate({ date }: { date: Date | null }) {
  if (!date) return <span>N/A</span>;

  // Client-side only rendering of the formatted date
  return (
    <span suppressHydrationWarning>
      {format(new Date(date), "MMM d, yyyy")}
    </span>
  );
}
