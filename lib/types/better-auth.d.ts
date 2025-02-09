export {};

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
  interface Session {
    user: UserWithRole;
    activeOrganizationId: string;
  }
  //   export interface User extends UserWithRole {}
  //   export interface Session extends Omit<BetterAuthSession, "user"> {
  //     activeOrganizationId: string;
  //     user: UserWithRole;
  //   }
}
