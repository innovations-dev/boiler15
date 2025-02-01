import React, { useEffect } from "react";
import { APIError as BetterAuthAPIError } from "better-auth/api";
import { toast } from "sonner";

export const ErrorHandler: React.FC = () => {
  useEffect(() => {
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      event.preventDefault();
      const error = "error" in event ? event.error : event.reason;

      if (error instanceof BetterAuthAPIError) {
        const message = error.message || "An authentication error occurred";
        toast.error(message);
        return error;
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  return null;
};
