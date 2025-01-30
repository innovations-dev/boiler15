import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const id = React.useId();
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "peer my-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          placeholder=" "
          ref={ref}
          id={id}
          {...props}
        />
        <label
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform select-none px-2 text-sm text-muted-foreground duration-200 before:absolute before:inset-0 before:-z-10 before:block before:bg-background before:transition-opacity before:delay-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:before:opacity-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary peer-focus:before:opacity-90"
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
