"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, type, label, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className="relative mt-4">
        <input
          id={id}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={id}
          className="absolute left-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-muted-foreground duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary"
        >
          {label}
        </label>
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export { FormInput };
