import * as React from "react";

import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardCard({ className, ...props }: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

interface DashboardCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

DashboardCard.Header = function DashboardCardHeader({
  className,
  ...props
}: DashboardCardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between p-6",
        className
      )}
      {...props}
    />
  );
};

interface DashboardCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

DashboardCard.Content = function DashboardCardContent({
  className,
  ...props
}: DashboardCardContentProps) {
  return <div className={cn("px-6 pb-4", className)} {...props} />;
};

interface DashboardCardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

DashboardCard.Title = function DashboardCardTitle({
  className,
  ...props
}: DashboardCardTitleProps) {
  return (
    <h3
      className={cn(
        "text-lg font-medium leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
};

interface DashboardCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

DashboardCard.Description = function DashboardCardDescription({
  className,
  ...props
}: DashboardCardDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
};
