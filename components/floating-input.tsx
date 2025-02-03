import * as React from "react";

import { cn } from "@/lib/utils";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const id = React.useId();
    return (
      <FormItem className="relative mt-4">
        <FormControl>
          <Input
            type={type}
            className={cn("peer", className)}
            ref={ref}
            id={id}
            {...props}
            placeholder=""
          />
        </FormControl>
        <FormLabel
          htmlFor={id}
          aria-hidden="true"
          className="pointer-events-none absolute left-1 top-0 z-10 origin-[0] -translate-y-4 scale-75 transform select-none px-2 text-sm text-muted-foreground duration-200 before:absolute before:inset-0 before:-z-10 before:block before:bg-background before:transition-opacity before:delay-150 peer-placeholder-shown:top-1/3 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:before:opacity-0 peer-focus:top-2 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary peer-focus:before:opacity-90"
        >
          {label}
        </FormLabel>
        <FormMessage id="email-description" aria-live="polite" />
      </FormItem>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
