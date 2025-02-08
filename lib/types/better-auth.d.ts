declare module "better-auth/api" {
  type BetterAuthError = { code?: string; message?: string };
  type Data<T> = T & { status: boolean };
  type Error$1<T> = { error: T };
  export type BetterAuthResponse<T> = Data<T> | Error$1<BetterAuthError>;

  export class APIError extends Error {
    code: string;
    statusCode: number;
    message: string;
  }
}
