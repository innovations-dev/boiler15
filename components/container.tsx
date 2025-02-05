import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  className?: string;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(
          "container mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-8",
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";
