declare module "better-auth/api" {
  import { Organization, User } from "@/lib/db/schema";

  export type BetterAuthError = {
    code: string;
    message: string;
    status: number;
  };

  export type BetterAuthResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
    error?: BetterAuthError;
  };

  export class APIError extends Error {
    code: string;
    status: number;
    message: string;
  }
}

declare module "better-auth" {
  export type Session = {
    activeOrganizationId: string;
    user: UserWithRole;
  };
}
