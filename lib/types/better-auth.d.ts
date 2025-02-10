export {};

declare module "better-auth/api" {
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
  import type { UserWithRole } from "better-auth/plugins";

  interface Session {
    session: {
      id: string;
      expiresAt: Date;
      token: string;
      userId: string;
      activeOrganizationId?: string | null;
      ipAddress?: string | null;
      userAgent?: string | null;
      impersonatedBy?: string | null;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
    };
    user: UserWithRole;
  }

  interface CustomSession extends Session {
    session: Session["session"] & {
      activeOrganizationId: string | null;
    };
    user: UserWithRole;
  }
}
